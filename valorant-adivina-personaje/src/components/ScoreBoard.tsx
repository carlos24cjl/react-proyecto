import React from 'react';

interface ScoreBoardProps {
  score: number;
  cluesUsed: number;
  gameStatus: string;
  incorrectGuesses: number;
  currentRound?: number;
  totalRounds?: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  score, 
  cluesUsed, 
  gameStatus, 
  incorrectGuesses,
  currentRound = 1,
  totalRounds = 1
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'playing': return 'bg-primary text-white';
      case 'won': return 'bg-success text-white';
      case 'round-completed': return 'bg-info text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'playing': return 'Jugando';
      case 'won': return '¡Correcto!';
      case 'round-completed': return 'Partida Completa';
      default: return 'Perdido';
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-light shadow">
          <div className="card-body bg-white">
            <div className="row text-center">
              <div className="col-md-2 mb-3 mb-md-0">
                <div className="text-muted small">Ronda</div>
                <div className="h4 text-dark">{currentRound}/{totalRounds}</div>
              </div>
              <div className="col-md-2 mb-3 mb-md-0">
                <div className="text-muted small">Puntuación</div>
                <div className="h4 text-warning">{score} pts</div>
              </div>
              <div className="col-md-2 mb-3 mb-md-0">
                <div className="text-muted small">Pistas Usadas</div>
                <div className="h4 text-info">{cluesUsed}</div>
              </div>
              <div className="col-md-2 mb-3 mb-md-0">
                <div className="text-muted small">Fallos</div>
                <div className="h4 text-danger">{incorrectGuesses}</div>
              </div>
              <div className="col-md-4">
                <div className="text-muted small">Estado</div>
                <span className={`badge ${getStatusBadge(gameStatus)} fs-6`}>
                  {getStatusText(gameStatus)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;