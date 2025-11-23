import { useState, useMemo } from 'react';
import type { FC } from 'react';
import type { Agent } from '../types/types';

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: string;
  onSelectAgent: (agentName: string) => void;
  gameStatus: string;
  incorrectGuesses: number;
}

const AgentSelector: FC<AgentSelectorProps> = ({ 
  agents, 
  selectedAgent, 
  onSelectAgent, 
  gameStatus,
  incorrectGuesses
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Obtener roles únicos
  const roles = useMemo(() => {
    const uniqueRoles = agents.reduce((acc: string[], agent) => {
      if (!acc.includes(agent.role.displayName)) {
        acc.push(agent.role.displayName);
      }
      return acc;
    }, []);
    return ['Todos', ...uniqueRoles];
  }, [agents]);

  // Filtrar agentes por búsqueda y rol
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.displayName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'Todos' || selectedRole === '' || agent.role.displayName === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [agents, searchTerm, selectedRole]);

  return (
    <div className="agent-selector">
      <h3>Selecciona el Agente</h3>
      
      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar agente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          disabled={gameStatus !== 'playing'}
        />
        
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="role-filter"
          disabled={gameStatus !== 'playing'}
        >
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div className="penalty-warning">
        {incorrectGuesses > 0 && (
          <div className="penalty-alert">
            ⚠️ Has fallado {incorrectGuesses} vez(es). -{incorrectGuesses * 10} puntos
          </div>
        )}
      </div>

      <div className="agents-grid">
        {filteredAgents.map(agent => (
          <button
            key={agent.uuid}
            onClick={() => onSelectAgent(agent.displayName)}
            disabled={gameStatus !== 'playing'}
            className={`agent-option ${
              selectedAgent === agent.displayName ? 'selected' : ''
            } ${gameStatus !== 'playing' && 
               selectedAgent === agent.displayName ? 
               (gameStatus === 'won' ? 'correct' : 'incorrect') : ''}`}
          >
            <img src={agent.displayIcon} alt={agent.displayName} />
            <span>{agent.displayName}</span>
            <small className="agent-role-badge">{agent.role.displayName}</small>
          </button>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="no-agents">
          No se encontraron agentes con los filtros aplicados.
        </div>
      )}

      {selectedAgent && gameStatus === 'playing' && (
        <div className="guess-feedback">
          ❌ Incorrecto. -10 puntos. ¡Sigue intentando!
        </div>
      )}
    </div>
  );
};

export default AgentSelector;