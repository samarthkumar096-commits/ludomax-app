import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Game.css';

function Game({ user }) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    currentPlayer: 0,
    players: ['red', 'green'],
    diceValue: 0,
    tokens: {
      red: [
        { id: 0, position: -1, inHome: true, finished: false },
        { id: 1, position: -1, inHome: true, finished: false },
        { id: 2, position: -1, inHome: true, finished: false },
        { id: 3, position: -1, inHome: true, finished: false }
      ],
      green: [
        { id: 0, position: -1, inHome: true, finished: false },
        { id: 1, position: -1, inHome: true, finished: false },
        { id: 2, position: -1, inHome: true, finished: false },
        { id: 3, position: -1, inHome: true, finished: false }
      ]
    },
    canRoll: true
  });

  const rollDice = () => {
    if (!gameState.canRoll) return;
    
    const value = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({
      ...prev,
      diceValue: value,
      canRoll: false
    }));

    // Simulate AI move for opponent
    setTimeout(() => {
      if (gameState.currentPlayer === 1) {
        nextTurn();
      }
    }, 2000);
  };

  const nextTurn = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % 2,
      canRoll: true,
      diceValue: 0
    }));
  };

  const exitGame = () => {
    if (window.confirm('Exit game? Entry fee will not be refunded.')) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-btn" onClick={exitGame}>← Exit</button>
        <div className="match-info">
          <span>Quick Match</span>
          <span>Win: ₹20</span>
        </div>
      </div>

      <div className="game-container">
        <div className="game-info">
          <div className="current-player">
            Current: <span style={{color: gameState.players[gameState.currentPlayer]}}>
              {gameState.currentPlayer === 0 ? 'You' : 'Opponent'}
            </span>
          </div>
          <div className="dice-section">
            <div className="dice">🎲</div>
            <button 
              className="roll-btn" 
              onClick={rollDice}
              disabled={!gameState.canRoll || gameState.currentPlayer !== 0}
            >
              Roll Dice
            </button>
            <div className="dice-result">{gameState.diceValue || ''}</div>
          </div>
        </div>

        <div className="board-placeholder">
          <h3>🎮 Ludo Board</h3>
          <p>Game in progress...</p>
          <div className="board-info">
            <div className="player-status">
              <h4>🔴 You</h4>
              <p>Tokens: 4 in home</p>
            </div>
            <div className="player-status">
              <h4>🟢 Opponent</h4>
              <p>Tokens: 4 in home</p>
            </div>
          </div>
        </div>

        <div className="game-actions">
          <button className="btn-action">Move Token</button>
          <button className="btn-action" onClick={nextTurn}>Skip Turn</button>
        </div>
      </div>

      <div className="ad-banner">
        <p>Advertisement</p>
        <div className="ad-content">🎮 Download More Games & Earn Rewards!</div>
      </div>
    </div>
  );
}

export default Game;
