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
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        
        color: '#fff',
        fontSize: '1.5rem',
        fontFamily: 'Press Start 2P, cursive'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div>Loading...</div>
          <div style={{
            marginTop: '20px',
            width: '100px',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '5px',
            overflow: 'hidden',
            margin: '20px auto 0'
          }}>
            <div style={{
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, #0ff, #f0f)',
              borderRadius: '5px',
              animation: 'loading 1.5s infinite ease-in-out'
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  const containerStyle = {
    minHeight: '100vh',
    padding: '2rem',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Press Start 2P, cursive',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyle = {
    marginBottom: '2rem',
    animation: 'glow 2s ease-in-out infinite alternate'
  };

  const welcomeStyle = {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    textShadow: '0 0 10px #0ff, 0 0 20px #0ff',
    color: '#fff'
  };

  const subtitleStyle = {
    fontSize: '1rem',
    marginBottom: '2rem',
    color: '#c5cae9'
  };

  const gameContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto 3rem'
  };

  const gameCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    borderRadius: '15px',
    padding: '2rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden'
  };

  const gameIconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem'
  };

  const gameTitleStyle = {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#fff'
  };

  const gameDescStyle = {
    fontSize: '0.7rem',
    color: '#b0bec5',
    lineHeight: '1.4'
  };

  const logoutButtonStyle = {
    padding: '12px 24px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    background: 'linear-gradient(145deg, #ff4d4d, #d32f2f)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)',
    fontFamily: 'Press Start 2P, cursive'
  };

  const GameCard = ({ title, description, icon, onClick }) => (
    <div 
      style={gameCardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
      }}
    >
      <div style={gameIconStyle}>{icon}</div>
      <div style={gameTitleStyle}>{title}</div>
      <div style={gameDescStyle}>{description}</div>
    </div>
  );

  return (
    <div style={containerStyle}>
      
      <div style={headerStyle}>
        <h1 style={welcomeStyle}>Welcome, {user.username}!</h1>
        <p style={subtitleStyle}>Choose a game to play:</p>
      </div>

      <div style={gameContainerStyle}>
        <GameCard 
          title="Rock Paper Scissors"
          description="Classic game of chance. Choose your weapon wisely!"
          icon="✊✋✌️"
          onClick={() => navigate('/rockpaperscissor')}
        />
        <GameCard 
          title="Tic-Tac-Toe"
          description="Strategic gameplay. Can you outsmart the AI?"
          icon="⭕❌"
          onClick={() => navigate('/tictactoe')}
        />
        <GameCard 
          title="Memory Game"
          description="Test your memory skills. Match all the pairs!"
          icon="🧠🎴"
          onClick={() => navigate('/memorygame')}
        />
        <GameCard 
          title="Quiz Game"
          description="Challenge your knowledge. How many questions can you answer?"
          icon="🧠❓"
          onClick={() => navigate('/quizgame')}
        />
      </div>

      <button 
        onClick={handleLogout} 
        style={logoutButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(145deg, #d32f2f, #b71c1c)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(145deg, #ff4d4d, #d32f2f)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;