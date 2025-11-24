import Game from './components/Game';
import Hero from './components/Hero';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎯 Valorant Agent Guessing Game</h1>
        <p>¿Puedes adivinar el agente con la menor cantidad de pistas?</p>
      </header>
      <main className="app-main">
        <Hero />
        <Game />
      </main>
    </div>
  );
}

export default App;