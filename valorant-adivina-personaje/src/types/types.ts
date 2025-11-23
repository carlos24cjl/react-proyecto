export interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  fullPortrait: string;
  background: string;
  role: {
    displayName: string;
    uuid: string;
  };
  abilities: Ability[];
  isPlayableCharacter: boolean;
}

export interface Ability {
  displayName: string;
  description: string;
  displayIcon: string;
}

export interface GameState {
  currentAgent: Agent | null;
  cluesUsed: number;
  score: number;
  gameStatus: 'playing' | 'won' | 'lost' | 'round-completed';
  selectedAgent: string;
  availableAgents: Agent[];
  incorrectGuesses: number;
  currentRound: number;
  totalRounds: number;
  roundScore: number;
  sessionScore: number;
  agentsInSession: Agent[];
  sessionCompleted: boolean;
}

export interface GameSession {
  id: string;
  playerName: string;
  totalScore: number;
  date: string;
  rounds: number;
  correctGuesses: number;
}

export interface Role {
  displayName: string;
  uuid: string;
}