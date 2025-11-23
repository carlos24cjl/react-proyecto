import type { FC } from 'react';

interface ClueDisplayProps {
  clue: string | null;
  cluesUsed: number;
  onUseClue: () => void;
  gameStatus: string;
  incorrectGuesses: number;
}

const ClueDisplay: FC<ClueDisplayProps> = ({ 
  clue, 
  cluesUsed, 
  onUseClue, 
  gameStatus,
  incorrectGuesses
}) => {
  const additionalClues = Math.max(0, cluesUsed - 1);

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-info shadow">
          <div className="card-header bg-info text-white">
            <h4 className="mb-0">🔍 Pistas Disponibles</h4>
          </div>
          <div className="card-body bg-white">
            {cluesUsed === 1 && (
              <div className="alert alert-success mb-3">
                🎁 <strong>Pista inicial gratuita</strong> - ¡No afecta tu puntuación!
              </div>
            )}
            
            <div className="bg-light border rounded p-4 text-center mb-3">
              <h5 className="text-dark">
                <strong>Pista {cluesUsed}:</strong> {clue}
              </h5>
            </div>
            
            {gameStatus === 'playing' && (
              <div className="text-center">
                <button 
                  onClick={onUseClue}
                  disabled={cluesUsed >= 5}
                  className="btn btn-info btn-lg text-white"
                >
                  {cluesUsed === 1 ? 'Obtener Segunda Pista' : `Obtener Pista ${cluesUsed + 1}`} 
                  ({cluesUsed}/5 total)
                </button>
              </div>
            )}

            <div className="mt-3 p-3 bg-light border rounded">
              <h6 className="text-warning mb-2">💡 Sistema de puntos:</h6>
              <div className="row text-small">
                <div className="col-md-6">
                  <div className="text-dark">• Puntos base: <strong>100 puntos</strong></div>
                  <div className="text-dark">• Pista inicial: <strong className="text-success">GRATUITA</strong></div>
                </div>
                <div className="col-md-6">
                  <div className="text-dark">• Pistas adicionales: <strong className="text-warning">-20 puntos</strong></div>
                  <div className="text-dark">• Fallos: <strong className="text-danger">-10 puntos</strong></div>
                </div>
              </div>
              {additionalClues > 0 && (
                <div className="mt-2 text-center">
                  <small className="text-warning">
                    Penalización actual: -{additionalClues * 20} puntos (por {additionalClues} pista(s) adicional(es))
                  </small>
                </div>
              )}
              {incorrectGuesses > 0 && (
                <div className="mt-2 text-center">
                  <small className="text-danger">Fallos actuales: {incorrectGuesses} ( -{incorrectGuesses * 10} pts )</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClueDisplay;