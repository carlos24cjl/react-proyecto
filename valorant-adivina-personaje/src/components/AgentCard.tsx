import type { FC } from 'react';
import type { Agent } from '../types/types';

interface AgentCardProps {
  agent: Agent;
  revealed: boolean;
  pointsEarned?: number;
}

const AgentCard: FC<AgentCardProps> = ({ agent, revealed, pointsEarned }) => {
  if (!revealed) {
    return (
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-dark border-warning text-center py-5">
            <div className="card-body">
              <div className="text-warning display-1 mb-3">?</div>
              <h3 className="text-light">¡Adivina el agente!</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="card valorant-card shadow-lg">
          <div className="card-header text-center">
            <h3 className="mb-0 fw-bold">🎉 ¡Agente Revelado!</h3>
            {pointsEarned !== undefined && pointsEarned > 0 && (
              <div className="valorant-badge fs-6 mt-2">
                +{pointsEarned} puntos ganados
              </div>
            )}
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-4 text-center">
                <img 
                  src={agent.fullPortrait} 
                  alt={agent.displayName}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '300px' }}
                />
              </div>
              <div className="col-md-8">
                <h2 className="text-danger fw-bold mb-3">{agent.displayName}</h2>
                <div className="mb-3">
                  <span className="valorant-badge fs-6">{agent.role.displayName}</span>
                </div>
                <p className="text-light mb-4">{agent.description}</p>
                
                <h5 className="text-warning mb-3">Habilidades:</h5>
                <div className="row g-2">
                  {agent.abilities.map((ability, index) => (
                    <div key={index} className="col-6 col-md-3">
                      <div className="card bg-dark border-secondary h-100">
                        <div className="card-body text-center p-2">
                          {ability.displayIcon && (
                            <img 
                              src={ability.displayIcon} 
                              alt={ability.displayName}
                              className="mb-1"
                              style={{ width: '30px', height: '30px' }}
                            />
                          )}
                          <div className="text-light small fw-bold">{ability.displayName}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;