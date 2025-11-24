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
      case 0: return { icon: '🥇', class: 'bg-warning text-white' };
      case 1: return { icon: '🥈', class: 'bg-secondary text-white' };
      case 2: return { icon: '🥉', class: 'bg-danger text-white' };
      default: return { icon: `#${position + 1}`, class: 'bg-dark border text-white' };
    }
  };

  const getTier = (score: number) => {
    if (score >= 400) return { name: 'Radiante', color: 'text-warning', bg: 'bg-warning' };
    if (score >= 300) return { name: 'Diamante', color: 'text-info', bg: 'bg-info' };
    if (score >= 200) return { name: 'Platino', color: 'text-success', bg: 'bg-success' };
    if (score >= 100) return { name: 'Oro', color: 'text-warning', bg: 'bg-warning' };
    return { name: 'Plata', color: 'text-light', bg: 'bg-secondary' };
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10 col-xl-8">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-danger fw-bold mb-2">🏆 Ranking Global</h1>
          <p className="text-muted fs-5">Las mejores partidas de Valorant Guessing Game</p>
        </div>

        {ranking.length === 0 ? (
          <div className="card valorant-card text-center py-5">
            <div className="card-body">
              <div className="text-muted fs-1 mb-3">🎯</div>
              <h3 className="text-light mb-3">¡Aún no hay partidas!</h3>
              <p className="text-muted mb-4">Sé el primero en aparecer en el ranking</p>
              <button onClick={onNewGame} className="btn btn-lg valorant-btn px-5">
                🎮 Jugar Mi Primera Partida
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="row mb-5">
              <div className="col-12">
                <h3 className="text-center text-light mb-4">Podium de Campeones</h3>
                <div className="row align-items-end justify-content-center">
                  {ranking.slice(0, 3).map((session, index) => (
                    <div key={session.id} className={`col-md-4 ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}>
                        <div className={`card valorant-card ${index === 0 ? 'shadow-lg' : 'shadow'} text-center h-100`}
                             style={{ transform: index === 0 ? 'scale(1.05)' : 'scale(0.95)' }}>
                          <div className="card-body py-4">
                            <div className={`valorant-badge fs-4 mb-3`}>
                              {getRankIcon(index).icon}
                            </div>
                            <div className="text-light fs-2 fw-bold mb-2">
                              {session.totalScore}
                            </div>
                            <div className="text-muted small">puntos</div>
                            <div className="mt-3">
                              <span className={`valorant-badge`}>
                                {getTier(session.totalScore).name}
                              </span>
                            </div>
                            <div className="text-muted small mt-2">
                              {session.correctGuesses}/{session.rounds} agentes
                            </div>
                            <div className="text-muted small">{session.date}</div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Ranking List */}
            <div className="card valorant-card">
              <div className="card-header text-light">
                <h4 className="mb-0 fw-bold">Clasificación Completa</h4>
              </div>
              <div className="card-body p-0">
                {ranking.map((session, index) => {
                  const rankInfo = getRankIcon(index);
                  const tier = getTier(session.totalScore);
                  
                  return (
                    <div key={session.id} className={`border-bottom border-secondary p-3`}>
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <span className={`badge ${rankInfo.class} fs-6`}>
                            {rankInfo.icon}
                          </span>
                        </div>
                        <div className="col">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="text-light fw-bold fs-5">
                                {session.totalScore} puntos
                              </div>
                              <div className="text-muted small">
                                {session.correctGuesses}/{session.rounds} agentes • {session.date}
                              </div>
                            </div>
                            <span className={`valorant-badge`}>
                              {tier.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="row mt-4">
          <div className="col-md-6 mb-2">
            <button onClick={onNewGame} className="btn btn-danger btn-lg w-100 py-3">
              🎮 Nueva Partida
            </button>
          </div>
          <div className="col-md-6 mb-2">
            <button onClick={onBack} className="btn btn-outline-light btn-lg w-100 py-3">
              ← Volver al Juego
            </button>
          </div>
        </div>

        {/* Tier Legend */}
        <div className="card valorant-card mt-4">
          <div className="card-header text-light text-center">
            <h5 className="mb-0 fw-bold">Leyenda de Tiers</h5>
          </div>
          <div className="card-body">
            <div className="row text-center g-3">
              <div className="col">
                <span className="valorant-badge me-2">R</span>
                <small className="text-light">Radiante (400+ pts)</small>
              </div>
              <div className="col">
                <span className="valorant-badge me-2">D</span>
                <small className="text-light">Diamante (300-399)</small>
              </div>
              <div className="col">
                <span className="valorant-badge me-2">P</span>
                <small className="text-light">Platino (200-299)</small>
              </div>
              <div className="col">
                <span className="valorant-badge me-2">O</span>
                <small className="text-light">Oro (100-199)</small>
              </div>
              <div className="col">
                <span className="valorant-badge me-2">S</span>
                <small className="text-light">Plata (0-99)</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;