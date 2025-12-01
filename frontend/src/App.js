import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Game from './components/Game';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="loading">Loading LudoMax...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />
          } />
          <Route path="/dashboard" element={
            user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />
          } />
          <Route path="/game/:gameId" element={
            user ? <Game user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
