import { useState, useMemo } from 'react';
import type { Agent } from '../../types/types';
import './AgentSelector.css';

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: string;
  onSelectAgent: (agentName: string) => void;
  gameStatus: string;
  incorrectGuesses: number;
}

const AgentSelector = ({ 
  agents, 
  selectedAgent, 
  onSelectAgent, 
  gameStatus,
  incorrectGuesses
}: AgentSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const roles = useMemo(() => {
    const uniqueRoles = agents.reduce((acc: string[], agent) => {
      if (!acc.includes(agent.role.displayName)) {
        acc.push(agent.role.displayName);
      }
      return acc;
    }, []);
    return ['Todos', ...uniqueRoles];
  }, [agents]);

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.displayName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'Todos' || selectedRole === '' || agent.role.displayName === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [agents, searchTerm, selectedRole]);

  const getButtonVariant = (agentName: string) => {
    if (gameStatus !== 'playing') {
      if (selectedAgent === agentName) {
        return gameStatus === 'won' ? 'success' : 'danger';
      }
      return 'outline-secondary';
    }
    return selectedAgent === agentName ? 'warning' : 'outline-dark';
  };

  return (
  <div className="component-container">
    <div className="centered-card card valorant-card shadow">
      <div className="card-header text-center">
        <h4 className="mb-0">🎯 Selecciona el Agente</h4>
      </div>
      <div className="card-body">
        {incorrectGuesses > 0 && (
          <div className="valorant-alert valorant-alert-danger text-center mb-3">
            ⚠️ Has fallado {incorrectGuesses} vez(es). -{incorrectGuesses * 10} puntos
          </div>
        )}

        <div className="row justify-content-center mb-3">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Buscar agente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control text-center"
              disabled={gameStatus !== 'playing'}
            />
          </div>
          <div className="col-md-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-select text-center"
              disabled={gameStatus !== 'playing'}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="agents-grid">
          {filteredAgents.map(agent => (
            <button
              key={agent.uuid}
              onClick={() => onSelectAgent(agent.displayName)}
              disabled={gameStatus !== 'playing'}
              className={`btn btn-${getButtonVariant(agent.displayName)} agent-button valorant-agent`}
            >
              <div className="d-flex flex-column align-items-center">
                <img 
                  src={agent.displayIcon} 
                  alt={agent.displayName}
                  className="mb-2"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <small className="fw-bold">{agent.displayName}</small>
                <small className="text-muted">{agent.role.displayName}</small>
              </div>
            </button>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center text-muted py-4">
            No se encontraron agentes con los filtros aplicados.
          </div>
        )}

        {selectedAgent && gameStatus === 'playing' && (
          <div className="valorant-alert valorant-alert-warning text-center mt-3">
            ❌ Incorrecto. -10 puntos. ¡Sigue intentando!
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default AgentSelector;