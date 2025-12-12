import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Rockpaperscissor from '../Components/Rockpaperscissor.jsx';
import Tictactoe from '../Components/Tictactoe.jsx';
import Memorygame from '../Components/Memorygame.jsx';
import Quizgame from '../Components/Quizgame.jsx';

const Home = () => {
  const [user, setUser] = useState(null);
  const [showHomeIntro, setShowHomeIntro] = useState(false);
  const [funFact, setFunFact] = useState('');
  const [activeGame, setActiveGame] = useState(null); // 'rps' | 'tictactoe' | 'memory' | 'quiz' | null
  const navigate = useNavigate();

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(userData);
  }, [navigate]);

  // Only show the home intro right after a fresh login/signup
  useEffect(() => {
    const shouldShow = localStorage.getItem('showHomeIntro') === 'true';
    if (shouldShow) {
      setShowHomeIntro(true);
      localStorage.removeItem('showHomeIntro');
    }
  }, []);

  // Pick a random fun fact each time Home dashboard is shown
  useEffect(() => {
    // Only pick a new fact when returning to the dashboard (activeGame is null)
    if (activeGame !== null) return;
    
    const facts = [
      'Your brain loves patterns – that is why Tic-Tac-Toe feels satisfying.',
      'Rock Paper Scissors has been played for hundreds of years.',
      'Memory games can help strengthen your attention and focus.',
      'Quizzes are a fun way to test what you really remember.',
      'Sir boogs kinda gay ngl',
      'You know jan leigh sucks dihh??',
      'Pleaseee Speed I neeed thissss',
      'Did you know cel is the giga nigga???',
      'Chat, brynt likes to touch kids',
      'I love me some diddy oil',
      'Dhenise the number#1 overthinker',
      'Victor be gooning to agnes fr fr',
      'Afel with gra gra when she did that gun shot on jan leigh lmao',
      'Dev is like the biggest gay nigger',
      'Choco the master baiter',
      'Chate, what do you call her? Cha-tae',
      'Arella the garlic bread master',
      'Ubas? Its grapes lil boi and remove the g',
      'The fallen of Malbas, is this nigga even alive?',
      'Cariaga the gyro master, like you know from jojo?',
      'Pauleen stop asking for more money bruh',
      'Where tf did this nigga go? Yes I meant harold the lost nigger too',
      'Jan leigh said he got 5.2 inches',
      'Did you not know that Chate is the prettiest?',
    ];

    const randomIndex = Math.floor(Math.random() * facts.length);
    setFunFact(facts[randomIndex]);
  }, [activeGame]);

  useEffect(() => {
    if (!showHomeIntro) return;
    const timer = setTimeout(() => setShowHomeIntro(false), 2200);
    return () => clearTimeout(timer);
  }, [showHomeIntro]);

  // Home page does not lock scroll; TicTacToe handles scroll on its own page

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // When a game is active, render it full-screen while staying on /home
  if (user && activeGame === 'rockpaperscissor') {
    return <Rockpaperscissor onBack={() => setActiveGame(null)} />;
  }

  if (user && activeGame === 'tictactoe') {
    return <Tictactoe onBack={() => setActiveGame(null)} />;
  }

  if (user && activeGame === 'memory') {
    return <Memorygame onBack={() => setActiveGame(null)} />;
  }

  if (user && activeGame === 'quiz') {
    return <Quizgame onBack={() => setActiveGame(null)} />;
  }

  if (!user) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#fff',
          fontSize: '1.5rem',
          fontFamily: 'Press Start 2P, cursive',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div>Loading...</div>
          <div
            style={{
              marginTop: '20px',
              width: '100px',
              height: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '5px',
              overflow: 'hidden',
              margin: '20px auto 0',
            }}
          >
            <div
              style={{
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, #0ff, #f0f)',
                borderRadius: '5px',
                animation: 'loading 1.5s infinite ease-in-out',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const containerStyle = {
    minHeight: '100vh',
    padding: isMobile ? '1rem 0.75rem' : '2rem',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Press Start 2P, cursive',
    position: 'relative',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
  };

  const headerStyle = {
    marginBottom: isMobile ? '1rem' : '2rem',
    animation: 'glow 2s ease-in-out infinite alternate',
    width: '100%',
    maxWidth: '1000px',
  };

  const welcomeStyle = {
    fontSize: isMobile ? '1.2rem' : '2.5rem',
    marginBottom: isMobile ? '0.5rem' : '1rem',
    textShadow: '0 0 10px #0ff, 0 0 20px #0ff',
    color: '#fff',
    wordBreak: 'break-word',
  };

  const subtitleStyle = {
    fontSize: isMobile ? '0.7rem' : '1rem',
    marginBottom: isMobile ? '1rem' : '2rem',
    color: '#c5cae9',
  };

  const gameContainerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
    gap: isMobile ? '1rem' : '2rem',
    maxWidth: '1000px',
    width: '100%',
    margin: '0 auto 2rem',
    padding: isMobile ? '0' : '0 1rem',
    boxSizing: 'border-box',
  };

  const leaderboardContainerStyle = {
    maxWidth: '600px',
    margin: '0 auto 2rem',
    textAlign: 'left',
    background: 'rgba(15, 23, 42, 0.9)',
    borderRadius: '12px',
    border: '1px solid rgba(148, 163, 184, 0.6)',
    padding: '1.25rem 1.5rem',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.9)',
  };

  const leaderboardTitleStyle = {
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#e5e7eb',
  };

  const leaderboardListStyle = {
    listStyle: 'decimal',
    paddingLeft: '1.25rem',
    margin: 0,
    fontSize: '0.8rem',
    color: '#cbd5f5',
  };

  const gameCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    borderRadius: '15px',
    padding: isMobile ? '1rem' : '2rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? '120px' : '180px',
  };

  const gameIconStyle = {
    fontSize: isMobile ? '1.8rem' : '3rem',
    marginBottom: isMobile ? '0.5rem' : '1rem',
  };

  const gameTitleStyle = {
    fontSize: isMobile ? '0.65rem' : '1rem',
    marginBottom: '0.5rem',
    color: '#fff',
  };

  const gameDescStyle = {
    fontSize: isMobile ? '0.5rem' : '0.7rem',
    color: '#b0bec5',
    lineHeight: '1.4',
  };

  const logoutButtonStyle = {
    padding: isMobile ? '6px 12px' : '12px 24px',
    fontSize: isMobile ? '0.5rem' : '0.9rem',
    cursor: 'pointer',
    background: 'linear-gradient(145deg, #ff4d4d, #d32f2f)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)',
    fontFamily: 'Press Start 2P, cursive',
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

  // Default: show the neon arcade dashboard with game cards + leaderboard
  return (
    <div style={containerStyle}>
      {showHomeIntro && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'radial-gradient(circle at center, rgba(15,23,42,0.12), rgba(15,23,42,0.98))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            pointerEvents: 'none',
            animation: 'fadeOutIntro 1.6s ease-out forwards',
            padding: '1rem',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontFamily: '"Press Start 2P", system-ui',
              fontSize: isMobile ? '0.8rem' : '1.1rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#f9fafb',
              textShadow:
                '0 0 14px rgba(56,189,248,0.95), 0 0 36px rgba(249,115,22,0.9)',
              animation: 'outroGlitch 1.2s ease-out',
            }}
          >
            4Games Arcade
            <div
              style={{
                marginTop: '0.9rem',
                fontSize: isMobile ? '0.5rem' : '0.7rem',
                fontFamily: '"Rajdhani", system-ui',
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                color: '#e5e7eb',
              }}
            >
              Choose a game to press start
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        position: 'relative', 
        marginBottom: isMobile ? '1rem' : '1.5rem',
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            ...logoutButtonStyle,
            position: isMobile ? 'relative' : 'absolute',
            top: isMobile ? 'auto' : 0,
            right: isMobile ? 'auto' : 0,
            marginBottom: isMobile ? '1rem' : 0,
            alignSelf: isMobile ? 'flex-end' : 'auto',
          }}
        >
          Log Out
        </button>
        <div style={{ ...headerStyle, textAlign: 'center' }}>
          <h1 style={welcomeStyle}>Welcome, {user.username}!</h1>
          <p style={subtitleStyle}>Choose a game to play:</p>
          {funFact && (
            <p
              style={{
                fontSize: isMobile ? '0.6rem' : '1rem',
                marginTop: '0.25rem',
                marginBottom: 0,
                color: '#9ca3af',
                padding: isMobile ? '0 0.5rem' : 0,
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: '#ffffff',
                  textShadow: '0 0 8px #0ff, 0 0 16px #0ff',
                  marginRight: '0.3rem',
                }}
              >
                Fun fact:
              </span>
              <span
                style={{
                  fontWeight: 500,
                  color: '#cbd5f5',
                }}
              >
                {funFact}
              </span>
            </p>
          )}
        </div>
      </div>

      <div style={gameContainerStyle}>
        <GameCard
          title="Rock Paper Scissors"
          description="Classic game of chance. Choose your weapon wisely!"
          icon="✊✋✌️"
          onClick={() => setActiveGame('rockpaperscissor')}
        />
        <GameCard
          title="Tic-Tac-Toe"
          description="Strategic gameplay. Can you outsmart the AI?"
          icon="⭕❌"
          onClick={() => setActiveGame('tictactoe')}
        />
        <GameCard
          title="Memory Game"
          description="Test your memory skills. Match all the pairs!"
          icon="🧠🎴"
          onClick={() => setActiveGame('memory')}
        />
        <GameCard
          title="Quiz Game"
          description="Challenge your knowledge. How many questions can you answer?"
          icon="🧠❓"
          onClick={() => setActiveGame('quiz')}
        />
      </div>

      {/* Leaderboard is now shown inside the TicTacToe view instead of here */}
    </div>
  );
};

export default Home;