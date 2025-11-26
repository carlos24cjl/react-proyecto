import { useState, useEffect } from 'react';
import type { Agent, GameState, GameSession } from '../../types/types';
import AgentCard from '../AgentCard/AgentCard';
import ClueDisplay from '../ClueDisplay/ClueDisplay';
import ScoreBoard from '../ScoreBoard/ScoreBoard';
import AgentSelector from '../AgentSelector/AgentSelector';
import Ranking from '../Ranking/Ranking';
import './Game.css';

function Game() {
  const [gameState, setGameState] = useState<GameState>({
    currentAgent: null,
    cluesUsed: 1,
    score: 0,
    gameStatus: 'playing',
    selectedAgent: '',
    availableAgents: [],
    incorrectGuesses: 0,
    currentRound: 1,
    totalRounds: 5,
    roundScore: 0,
    sessionScore: 0,
    agentsInSession: [],
    sessionCompleted: false
  });

  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  
  const [ranking, setRanking] = useState<GameSession[]>([]);
  const [showRanking, setShowRanking] = useState(false);
  const [showNameModal, setShowNameModal] = useState(true);

  useEffect(() => {
    const savedRanking = localStorage.getItem('valorant-game-ranking');
    if (savedRanking) {
      setRanking(JSON.parse(savedRanking));
    }
  }, []);

  // Selecciona X agentes al azar de la lista total
  const getRandomAgents = (agents: Agent[], count: number): Agent[] => {
    const shuffled = [...agents].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Inicia una nueva partida de 5 rondas con agentes aleatorios
  const initializeSession = (agents: Agent[]) => {
    const sessionAgents = getRandomAgents(agents, 5);
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
  };

  // Descarga la lista de agentes de Valorant al cargar la página
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('https://valorant-api.com/v1/agents');
        const data = await response.json();
        const playableAgents = data.data.filter((agent: Agent) => 
          agent.isPlayableCharacter && agent.fullPortrait
        );
        setAllAgents(playableAgents);
        initializeSession(playableAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

 

  // Devuelve la pista que corresponde según las pistas usadas
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

  // Maneja el intento de adivinar: calcula puntos o penaliza fallos
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

  // Guarda la partida terminada en el ranking y localStorage
  const completeSession = (finalScore: number) => {
    const sessionId = `session_${Date.now()}`;
    
    const newGameSession: GameSession = {
      id: sessionId,
      totalScore: finalScore,
      date: new Date().toLocaleDateString('es-ES'),
      rounds: gameState.totalRounds,
      correctGuesses: gameState.currentRound
    };

    const updatedRanking = [newGameSession, ...ranking]
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
    
    setRanking(updatedRanking);
    localStorage.setItem('valorant-game-ranking', JSON.stringify(updatedRanking));
    
    setGameState(prev => ({
      ...prev,
      sessionCompleted: true
    }));
    // Mostrar ranking automáticamente al completar la sesión
    setShowRanking(true);
  };

  const startNewSession = () => {
    if (allAgents.length > 0) {
      initializeSession(allAgents);
      setShowRanking(false);
    }
  };

  const currentClue = getNextClue();

  if (showNameModal) {
    return (
      <div className="modal show d-block valorant-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg">
            <div className="modal-header border-bottom">
              <h2 className="modal-title valorant-badge w-100 text-center fw-bold">🎯 VALORANT GUESSING GAME</h2>
            </div>
            <div className="modal-body text-center py-4">
              <p className="text-light fs-5 mb-3">¿Puedes adivinar el agente con la menor cantidad de pistas?</p>
              <p className="text-muted">Cada partida contiene 5 agentes aleatorios</p>

              <div className="game-rules mb-4 p-3 valorant-alert border rounded">
                <h5 className="text-warning mb-3">🏆 Sistema de Puntos</h5>
                <div className="row text-start">
                  <div className="col-6">
                    <small className="text-success">✓ Pista inicial: GRATIS</small><br />
                    <small className="text-warning">✓ Pistas extra: -20 pts</small>
                  </div>
                  <div className="col-6">
                    <small className="text-danger">✗ Fallos: -10 pts</small><br />
                    <small className="text-info">🎯 Máximo: 100 pts/ronda</small>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowNameModal(false)} className="btn btn-lg w-100 fw-bold py-3 valorant-btn">
                🎮 COMENZAR PARTIDA
              </button>

              <button
                onClick={() => {
                  setShowNameModal(false);
                  setShowRanking(true);
                }}
                className="btn btn-outline-dark w-100 mt-2 valorant-btn btn-outline"
              >
                📊 Ver Ranking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showRanking) {
    return (
      <div className="main-content">
        <div className="component-container">
          <Ranking 
            ranking={ranking}
            onBack={() => setShowRanking(false)}
            onNewGame={startNewSession}
          />
        </div>
      </div>
    );
  }

  

  return (
    <div className="main-content">
      
      {/* Session Header */}
      <div className="component-container">
        <div className="centered-card card valorant-card shadow">
          <div className="card-body text-center py-3">
            <div className="row align-items-center">
              <div className="col-md-4">
              <h3 className="text-light mb-0">
                  <span className="text-danger">🎯</span> Partida {gameState.currentRound}/{gameState.totalRounds}
                </h3>
              </div>
              <div className="col-md-4">
                <div className="text-warning h4 mb-0 fw-bold">
                  {gameState.sessionScore} pts
                </div>
                <small className="text-muted">Puntuación Total</small>
              </div>
              <div className="col-md-4">
                <button 
                  onClick={() => setShowRanking(true)}
                  className="btn btn-outline-warning"
                >
                  🏆 Ranking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="component-container">
        <ScoreBoard 
          score={gameState.sessionScore}
          cluesUsed={gameState.cluesUsed}
          gameStatus={gameState.gameStatus}
          incorrectGuesses={gameState.incorrectGuesses}
          currentRound={gameState.currentRound}
          totalRounds={gameState.totalRounds}
        />
      </div>

      {gameState.currentAgent && (
        <>
          <div className="component-container">
            <ClueDisplay 
              clue={currentClue}
              cluesUsed={gameState.cluesUsed}
              onUseClue={useClue}
              gameStatus={gameState.gameStatus}
              incorrectGuesses={gameState.incorrectGuesses}
            />
          </div>

          <div className="component-container">
            <AgentSelector
              agents={allAgents}
              selectedAgent={gameState.selectedAgent}
              onSelectAgent={handleGuess}
              gameStatus={gameState.gameStatus}
              incorrectGuesses={gameState.incorrectGuesses}
            />
          </div>

          {gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'round-completed' && (
            <div className="component-container">
              <AgentCard 
                agent={gameState.currentAgent}
                revealed={true}
                pointsEarned={gameState.roundScore}
              />
            </div>
          )}

          {gameState.gameStatus === 'won' && (
            <div className="component-container">
              <button onClick={nextRound} className="btn btn-success btn-lg fw-bold px-5 py-3">
                {gameState.currentRound < gameState.totalRounds ? 
                  `➡️ Siguiente Agente (${gameState.currentRound}/${gameState.totalRounds})` : 
                  '🏁 Finalizar Partida'
                }
              </button>
            </div>
          )}

          {gameState.gameStatus === 'round-completed' && (
            <div className="component-container">
              <div className="valorant-alert valorant-alert-success border-0 shadow text-center">
                    <h2 className="mb-2">🎉 ¡Partida Completada!</h2>
                    <p className="mb-0">Calculando puntuación final...</p>
                  </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;