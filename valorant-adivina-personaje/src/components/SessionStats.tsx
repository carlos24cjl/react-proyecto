import type { FC } from 'react';
import type { GameState, GameSession } from '../types/types';

interface SessionStatsProps {
  gameState: GameState;
  playerName: string;
  ranking: GameSession[];
  onNewGame: () => void;
  onViewRanking: () => void;
}

const SessionStats: FC<SessionStatsProps> = ({ 
  gameState, 
  playerName, 
  ranking, 
  onNewGame, 
  onViewRanking 
}) => {
  const playerRank = ranking.findIndex(session => session.playerName === playerName) + 1;
  const isTopScore = playerRank <= 3;

  return (
    <div className="session-stats">
      <div className="stats-content">
        <h2>🎯 Partida Completada</h2>
        
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Jugador:</span>
            <span className="stat-value">{playerName}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Puntuación Final:</span>
            <span className="stat-value highlight">{gameState.sessionScore} pts</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Agentes Adivinados:</span>
            <span className="stat-value">
              {gameState.currentRound}/{gameState.totalRounds}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Posición en Ranking:</span>
            <span className={`stat-value ${isTopScore ? 'top-rank' : ''}`}>
              #{playerRank} {isTopScore ? '🏆' : ''}
            </span>
          </div>
        </div>

        {isTopScore && (
          <div className="top-score-celebration">
            🎉 ¡NUEVO RÉCORD EN EL TOP {playerRank}! 🎉
          </div>
        )}

        <div className="stats-actions">
          <button onClick={onNewGame} className="new-game-btn">
            🎮 Nueva Partida
          </button>
          <button onClick={onViewRanking} className="ranking-btn">
            🏆 Ver Ranking Completo
          </button>
        </div>

        <div className="quick-ranking">
          <h3>Top 3</h3>
          {ranking.slice(0, 3).map((session, index) => (
            <div key={session.id} className={`top-player ${index === 0 ? 'first' : ''}`}>
              <span className="rank">#{index + 1}</span>
              <span className="name">{session.playerName}</span>
              <span className="score">{session.totalScore} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionStats;