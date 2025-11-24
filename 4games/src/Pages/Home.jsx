// src/Pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const gameContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '2rem',
    justifyContent: 'center'
  };

  const gameButtonStyle = {
    padding: '20px 30px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s, transform 0.2s',
  };

  return (
    <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>
      <h1>Welcome, {user.username}!</h1>
      <p>Choose a game to play:</p>

      <div style={gameContainerStyle}>
        <button 
          style={gameButtonStyle}
          onClick={() => navigate('/rockpaperscissor')}
        >
          Rock Paper Scissors
        </button>
        <button 
          style={gameButtonStyle}
          onClick={() => navigate('/tictactoe')}
        >
          Tic-Tac-Toe
        </button>
        <button 
          style={gameButtonStyle}
          onClick={() => navigate('/memorygame')}
        >
          Memory Game
        </button>
        <button 
          style={gameButtonStyle}
          onClick={() => navigate('/quizgame')}
        >
          Quiz Game
        </button>
      </div>

      <button 
        onClick={handleLogout} 
        style={{ 
          marginTop: '3rem',
          padding: '10px 15px', 
          cursor: 'pointer', 
          background: '#ff4d4d', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px' 
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;