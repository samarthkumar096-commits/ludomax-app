import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Dashboard({ user, setUser }) {
  const [wallet, setWallet] = useState(user.wallet);
  const [tournaments, setTournaments] = useState([]);
  const [showAddCash, setShowAddCash] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tournament/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTournaments(response.data.tournaments);
      }
    } catch (error) {
      console.error('Error loading tournaments:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const startQuickMatch = async (entryFee) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/game/create`,
        { type: 'quick-match', entryFee },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        navigate(`/game/${response.data.game.gameId}`);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to start game');
    }
  };

  const claimDailyBonus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/referral/daily-bonus`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setWallet(response.data.wallet);
        alert(`Daily bonus claimed! ₹${response.data.bonus} added. Streak: ${response.data.streak} days`);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to claim bonus');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h1>🎲 LudoMax</h1>
        </div>
        <div className="user-section">
          <div className="wallet">
            <span>💰 ₹{wallet.balance + wallet.bonus}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="hero-section">
          <h2>🏆 Welcome, {user.name}!</h2>
          <p>Play Ludo & Win Real Cash Daily</p>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>₹{user.stats?.totalEarnings || 0}</h3>
              <p>Total Earnings</p>
            </div>
            <div className="stat-card">
              <h3>{user.stats?.gamesWon || 0}</h3>
              <p>Games Won</p>
            </div>
            <div className="stat-card">
              <h3>{user.stats?.gamesPlayed || 0}</h3>
              <p>Games Played</p>
            </div>
          </div>
        </div>

        <div className="game-modes">
          <h3>🎮 Choose Game Mode</h3>
          
          <div className="mode-card">
            <div className="mode-header">
              <h4>⚡ Quick Match</h4>
              <span className="badge">Fast</span>
            </div>
            <p>Play instant 1v1 matches</p>
            <div className="entry-fees">
              <button onClick={() => startQuickMatch(10)}>₹10</button>
              <button onClick={() => startQuickMatch(50)}>₹50</button>
              <button onClick={() => startQuickMatch(100)}>₹100</button>
              <button onClick={() => startQuickMatch(500)}>₹500</button>
            </div>
          </div>

          <div className="mode-card">
            <div className="mode-header">
              <h4>🏆 Tournaments</h4>
              <span className="badge hot">🔥 HOT</span>
            </div>
            <p>Join tournaments & win big prizes!</p>
            {tournaments.length > 0 ? (
              <div className="tournament-list">
                {tournaments.slice(0, 3).map(t => (
                  <div key={t._id} className="tournament-item">
                    <div>
                      <strong>{t.name}</strong>
                      <p>Prize: ₹{t.prizePool} | Entry: ₹{t.entryFee}</p>
                    </div>
                    <button className="btn-small">Join</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No active tournaments</p>
            )}
          </div>
        </div>

        <div className="earning-section">
          <h3>💸 More Ways to Earn</h3>
          <div className="earning-grid">
            <div className="earn-card" onClick={() => setShowReferral(true)}>
              <span className="icon">👥</span>
              <h4>Refer & Earn</h4>
              <p>Get ₹50 per referral</p>
            </div>
            <div className="earn-card" onClick={claimDailyBonus}>
              <span className="icon">🎁</span>
              <h4>Daily Bonus</h4>
              <p>Login daily for rewards</p>
            </div>
            <div className="earn-card">
              <span className="icon">🎰</span>
              <h4>Spin & Win</h4>
              <p>Win up to ₹1000</p>
            </div>
            <div className="earn-card">
              <span className="icon">📺</span>
              <h4>Watch Ads</h4>
              <p>Earn ₹2 per ad</p>
            </div>
          </div>
        </div>
      </div>

      {showReferral && (
        <div className="modal" onClick={() => setShowReferral(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>👥 Refer & Earn ₹50</h3>
            <p>Share your code and earn ₹50 for each friend!</p>
            <div className="referral-code">
              <input type="text" value={user.referralCode} readOnly />
              <button onClick={() => {
                navigator.clipboard.writeText(user.referralCode);
                alert('Referral code copied!');
              }}>Copy</button>
            </div>
            <button className="btn btn-primary" onClick={() => setShowReferral(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
