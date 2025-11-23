import type { FC } from 'react';
import type { GameSession } from '../types/types';

interface RankingProps {
  ranking: GameSession[];
  onBack: () => void;
  onNewGame: () => void;
}

const Ranking: FC<RankingProps> = ({ ranking, onBack, onNewGame }) => {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${position + 1}`;
    }
  };

  return (
    <div className="ranking-container">
      <div className="ranking-content">
        <h2>🏆 Ranking de Jugadores</h2>
        
        {ranking.length === 0 ? (
          <div className="no-ranking">
            <p>¡Aún no hay partidas jugadas!</p>
            <p>Sé el primero en aparecer en el ranking.</p>
          </div>
        ) : (
          <div className="ranking-list">
            {ranking.map((session, index) => (
              <div key={session.id} className={`ranking-item ${index < 3 ? 'top-three' : ''}`}>
                <div className="rank-position">
                  <span className="rank-icon">{getRankIcon(index)}</span>
                </div>
                <div className="player-info">
                  <span className="player-name">{session.playerName}</span>
                  <span className="session-date">{session.date}</span>
                </div>
                <div className="session-stats">
                  <span className="score">{session.totalScore} pts</span>
                  <span className="rounds">
                    {session.correctGuesses}/{session.rounds} agentes
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="ranking-actions">
          <button onClick={onNewGame} className="new-game-btn">
            🎮 Nueva Partida
          </button>
          <button onClick={onBack} className="back-btn">
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ranking;