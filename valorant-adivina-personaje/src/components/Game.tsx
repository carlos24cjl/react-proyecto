import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import type { Agent, GameState, GameSession } from '../types/types';

// Utility: select N random agents from the pool
const getRandomAgents = (agents: Agent[], count: number): Agent[] => {
  const shuffled = [...agents].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
import AgentCard from './AgentCard';
import ClueDisplay from './ClueDisplay';
import ScoreBoard from './ScoreBoard';
import AgentSelector from './AgentSelector';
import SessionStats from './SessionStats.tsx';
import Ranking from './Ranking.tsx';

const Game: FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentAgent: null,
    cluesUsed: 1,
    score: 0,
    gameStatus: 'playing',
    selectedAgent: '',
    availableAgents: [],
    incorrectGuesses: 0,
    currentRound: 1,
    totalRounds: 5, // 👈 5 agentes por partida
    roundScore: 0,
    sessionScore: 0,
    agentsInSession: [],
    sessionCompleted: false
  });

  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [showSessionStats, setShowSessionStats] = useState(false);
  const [ranking, setRanking] = useState<GameSession[]>(() => {
    try {
      const saved = localStorage.getItem('valorant-game-ranking');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showRanking, setShowRanking] = useState(false);

  // startSession will be memoized; getRandomAgents is defined below
  const startSession = useCallback((agents: Agent[]) => {
    const sessionAgents = getRandomAgents(agents, 5); // 5 agentes por partida
    const firstAgent = sessionAgents[0];

    setGameState(prev => ({
      ...prev,
      currentAgent: firstAgent,
      cluesUsed: 1,
      gameStatus: 'playing',
      selectedAgent: '',
      incorrectGuesses: 0,
      currentRound: 1,
      roundScore: 0,
      sessionScore: 0,
      agentsInSession: sessionAgents,
      sessionCompleted: false,
      availableAgents: agents
    }));
  }, [setGameState]);

  // ranking is initialized from localStorage in the useState lazy initializer above

  // Fetch agents from Valorant API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('https://valorant-api.com/v1/agents');
        const data = await response.json();
        const playableAgents = data.data.filter((agent: Agent) => 
          agent.isPlayableCharacter && agent.fullPortrait
        );
  setAllAgents(playableAgents);
  startSession(playableAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, [startSession]);

  

  const getNextClue = () => {
    if (!gameState.currentAgent) return null;

    const clues = [
      `Rol: ${gameState.currentAgent.role.displayName}`,
      `Habilidad 1: ${gameState.currentAgent.abilities[0]?.displayName || 'Desconocida'}`,
      `Habilidad 2: ${gameState.currentAgent.abilities[1]?.displayName || 'Desconocida'}`,
      `Descripción: ${gameState.currentAgent.description.substring(0, 100)}...`,
      `Habilidad definitiva: ${gameState.currentAgent.abilities[3]?.displayName || 'Desconocida'}`
    ];

    return clues[gameState.cluesUsed - 1] || clues[clues.length - 1];
  };

  const useClue = () => {
    if (gameState.cluesUsed >= 5) return;
    
    setGameState(prev => ({
      ...prev,
      cluesUsed: prev.cluesUsed + 1
    }));
  };

  const handleGuess = (agentName: string) => {
    if (!gameState.currentAgent || gameState.gameStatus !== 'playing') return;

    if (agentName === gameState.currentAgent.displayName) {
      const basePoints = Math.max(100 - (Math.max(0, gameState.cluesUsed - 1) * 20), 10);
      const penalty = gameState.incorrectGuesses * 10;
      const roundPoints = Math.max(basePoints - penalty, 0);
      
      const newSessionScore = gameState.sessionScore + roundPoints;
      const isLastRound = gameState.currentRound >= gameState.totalRounds;

      setGameState(prev => ({
        ...prev,
        gameStatus: isLastRound ? 'round-completed' : 'won',
        roundScore: roundPoints,
        sessionScore: newSessionScore,
        selectedAgent: agentName
      }));

      if (isLastRound) {
        setTimeout(() => {
          completeSession(newSessionScore);
        }, 2000);
      }
    } else {
      setGameState(prev => ({
        ...prev,
        selectedAgent: agentName,
        incorrectGuesses: prev.incorrectGuesses + 1,
        score: Math.max(prev.score - 10, 0)
      }));
    }
  };

  const nextRound = () => {
    const nextRoundNumber = gameState.currentRound + 1;
    const nextAgent = gameState.agentsInSession[nextRoundNumber - 1];

    setGameState(prev => ({
      ...prev,
      currentAgent: nextAgent,
      cluesUsed: 1,
      gameStatus: 'playing',
      selectedAgent: '',
      incorrectGuesses: 0,
      currentRound: nextRoundNumber,
      roundScore: 0
    }));
  };

  const completeSession = (finalScore: number) => {
    const correctGuesses = gameState.agentsInSession.filter((_, index) => 
      index < gameState.currentRound
    ).length;

    const newGameSession: GameSession = {
      id: Date.now().toString(),
      playerName: playerName || 'Jugador Anónimo',
      totalScore: finalScore,
      date: new Date().toLocaleDateString('es-ES'),
      rounds: gameState.totalRounds,
      correctGuesses: correctGuesses
    };

    const updatedRanking = [newGameSession, ...ranking].sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);
    
    setRanking(updatedRanking);
    localStorage.setItem('valorant-game-ranking', JSON.stringify(updatedRanking));
    
    setGameState(prev => ({
      ...prev,
      sessionCompleted: true
    }));
    setShowSessionStats(true);
  };

  const startNewSession = () => {
    if (allAgents.length > 0) {
      startSession(allAgents);
      setShowSessionStats(false);
      setPlayerName('');
    }
  };

  const currentClue = getNextClue();

  if (!playerName && !gameState.sessionCompleted) {
    return (
      <div className="player-name-modal">
        <div className="modal-content">
          <h2>🎯 Valorant Guessing Game</h2>
          <p>Introduce tu nombre para el ranking:</p>
          <input
            type="text"
            placeholder="Tu nombre..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="name-input"
            maxLength={20}
          />
          <button 
            onClick={() => setPlayerName(playerName || 'Jugador Anónimo')}
            className="start-game-btn"
            disabled={!playerName.trim()}
          >
            Comenzar Partida
          </button>
          <button 
            onClick={() => setShowRanking(true)}
            className="view-ranking-btn"
          >
            Ver Ranking
          </button>
        </div>
      </div>
    );
  }

  if (showRanking) {
    return (
      <Ranking 
        ranking={ranking}
        onBack={() => setShowRanking(false)}
        onNewGame={() => {
          setShowRanking(false);
          setPlayerName('');
        }}
      />
    );
  }

  if (showSessionStats) {
    return (
      <SessionStats
        gameState={gameState}
        playerName={playerName}
        ranking={ranking}
        onNewGame={startNewSession}
        onViewRanking={() => {
          setShowSessionStats(false);
          setShowRanking(true);
        }}
      />
    );
  }

  return (
    <div className="game-container">
      <div className="session-header">
        <h3>Partida {gameState.currentRound}/{gameState.totalRounds}</h3>
        <div className="session-score">Puntuación: {gameState.sessionScore} pts</div>
        <button 
          onClick={() => setShowRanking(true)}
          className="ranking-btn"
        >
          🏆 Ranking
        </button>
      </div>

      <ScoreBoard 
        score={gameState.sessionScore}
        cluesUsed={gameState.cluesUsed}
        gameStatus={gameState.gameStatus}
        incorrectGuesses={gameState.incorrectGuesses}
        currentRound={gameState.currentRound}
        totalRounds={gameState.totalRounds}
      />

      {gameState.currentAgent && (
        <>
          <ClueDisplay 
            clue={currentClue}
            cluesUsed={gameState.cluesUsed}
            onUseClue={useClue}
            gameStatus={gameState.gameStatus}
            incorrectGuesses={gameState.incorrectGuesses}
          />

          <AgentSelector
            agents={allAgents}
            selectedAgent={gameState.selectedAgent}
            onSelectAgent={handleGuess}
            gameStatus={gameState.gameStatus}
            incorrectGuesses={gameState.incorrectGuesses}
          />

          {gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'round-completed' && (
            <AgentCard 
              agent={gameState.currentAgent}
              revealed={true}
              pointsEarned={gameState.roundScore}
            />
          )}

          {gameState.gameStatus === 'won' && (
            <div className="next-round-container">
              <button onClick={nextRound} className="next-round-btn">
                {gameState.currentRound < gameState.totalRounds ? 
                  `Siguiente Agente (${gameState.currentRound}/${gameState.totalRounds}) →` : 
                  'Finalizar Partida'
                }
              </button>
            </div>
          )}

          {gameState.gameStatus === 'round-completed' && (
            <div className="round-completed">
              <h2>🎉 ¡Partida Completada!</h2>
              <p>Calculando puntuación final...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;