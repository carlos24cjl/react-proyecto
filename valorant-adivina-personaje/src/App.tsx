import Game from './components/Game';
import './App.css';

function App() {
  return (
    <div className="App bg-light text-dark min-vh-100">
      <div className="container-fluid py-4">
        <header className="text-center mb-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-danger mb-2">
                🎯 Valorant Agent Guessing Game
              </h1>
              <p className="lead text-dark">
                ¿Puedes adivinar el agente con la menor cantidad de pistas?
              </p>
              <div className="border-bottom border-danger pb-3"></div>
            </div>
          </div>
        </header>
        <Game />
      </div>
    </div>
  );
}

export default App;