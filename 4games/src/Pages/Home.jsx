import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tictactoe from '../Components/Tictactoe';

const Home = () => {
  const [user, setUser] = useState(null);
  const [showTicTacToe, setShowTicTacToe] = useState(false);
  const [ticTacToeIntro, setTicTacToeIntro] = useState(false);
  const [ticTacToeControls, setTicTacToeControls] = useState({ resetGame: null, resetAll: null });
  const [ticTacToeMode, setTicTacToeMode] = useState('ai'); // 'ai' or '2p'
  const [setGameModeFn, setSetGameModeFn] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leaderboard');
        if (!res.ok) return;
        const data = await res.json();
        setLeaderboard(Array.isArray(data) ? data : []);
      } catch {
        // ignore network errors for now
      }
    };

    fetchLeaderboard();
    const id = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showTicTacToe]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

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
    padding: '2rem',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Press Start 2P, cursive',
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle = {
    marginBottom: '2rem',
    animation: 'glow 2s ease-in-out infinite alternate',
  };

  const welcomeStyle = {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    textShadow: '0 0 10px #0ff, 0 0 20px #0ff',
    color: '#fff',
  };

  const subtitleStyle = {
    fontSize: '1rem',
    marginBottom: '2rem',
    color: '#c5cae9',
  };

  const gameContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto 3rem',
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
    padding: '2rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  };

  const gameIconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
  };

  const gameTitleStyle = {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#fff',
  };

  const gameDescStyle = {
    fontSize: '0.7rem',
    color: '#b0bec5',
    lineHeight: '1.4',
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
    fontFamily: 'Press Start 2P, cursive',
  };

  // When in TicTacToe mode, show the full-screen arcade-style game layout
  if (showTicTacToe) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          background:
            'radial-gradient(circle at top, #0f172a 0, #020617 55%, #000000 100%)',
          color: '#e5e7eb',
          fontFamily:
            '"Rajdhani", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Left sidebar styled like player panel */}
        <div
          style={{
            width: '270px',
            background:
              'linear-gradient(180deg, #020617 0%, #020617 40%, #020617 100%)',
            borderRight: '1px solid #1f2937',
            boxShadow: '8px 0 25px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '0.9rem 1rem',
              borderBottom: '1px solid #1f2937',
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(90deg, #0f172a, #1e293b)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 20%, #fecaca, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.6rem',
                fontSize: '1.1rem',
              }}
            >
              😎
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {user.username}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#e5e7eb', textTransform: 'uppercase' }}>
                Player
              </div>
            </div>
          </div>
          <div
            style={{
              padding: '0.55rem 0.9rem',
              borderBottom: '1px solid #18263b',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Players</span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => {
                  setTicTacToeMode('ai');
                  if (setGameModeFn) setGameModeFn('ai');
                }}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  border: ticTacToeMode === 'ai' ? 'none' : '1px solid #9ca3af',
                  background: ticTacToeMode === 'ai'
                    ? 'linear-gradient(135deg, #f97316, #fb923c)'
                    : 'transparent',
                  color: ticTacToeMode === 'ai' ? '#0f172a' : '#e5e7eb',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  boxShadow:
                    ticTacToeMode === 'ai' ? '0 0 12px rgba(249,115,22,0.7)' : 'none',
                }}
              >
                <span role="img" aria-label="bot">
                  🤖
                </span>
                Bots
              </button>
              <button
                type="button"
                onClick={() => {
                  setTicTacToeMode('2p');
                  if (setGameModeFn) setGameModeFn('2p');
                }}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  border: ticTacToeMode === '2p' ? 'none' : '1px solid #9ca3af',
                  background: ticTacToeMode === '2p'
                    ? 'linear-gradient(135deg, #f97316, #fb923c)'
                    : 'transparent',
                  color: ticTacToeMode === '2p' ? '#0f172a' : '#e5e7eb',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  boxShadow:
                    ticTacToeMode === '2p' ? '0 0 12px rgba(249,115,22,0.7)' : 'none',
                }}
              >
                <span role="img" aria-label="two players">
                  👥
                </span>
                2 Players
              </button>
            </div>
          </div>
          <div
            style={{
              padding: '0.35rem 0',
              flex: 1,
            }}
          >
            {/* You row */}
            <div
              style={{
                padding: '0.5rem 0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: '1px solid #18263b',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                }}
              >
                😎
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                <span role="img" aria-label="crown" style={{ marginRight: '0.2rem' }}>
                  👑
                </span>
                You
              </div>
            </div>
            {/* Bot row (dimmed in 2-player mode) */}
            <div
              style={{
                padding: '0.5rem 0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: ticTacToeMode === 'ai' ? 1 : 0.5,
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                }}
              >
                🤖
              </div>
              <div style={{ fontSize: '0.8rem' }}>Bot</div>
            </div>

            {/* Controls area under players list */}
            <div
              style={{
                padding: '0.75rem 0.9rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  if (ticTacToeControls.resetGame) {
                    ticTacToeControls.resetGame();
                  }
                }}
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  background:
                    'radial-gradient(circle at top, #22c55e, #16a34a)',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '999px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  boxShadow: '0 0 14px rgba(34,197,94,0.8)',
                }}
              >
                Reset Board
              </button>
              <button
                type="button"
                onClick={() => {
                  if (ticTacToeControls.resetAll) {
                    ticTacToeControls.resetAll();
                  }
                }}
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  background:
                    'radial-gradient(circle at top, #22c55e, #16a34a)',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '999px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  boxShadow: '0 0 14px rgba(34,197,94,0.8)',
                }}
              >
                Reset & Clear Scores
              </button>
            </div>

              {/* How to play rules */}
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem 0.9rem',
                  borderTop: '1px solid #1f2937',
                  fontSize: '0.75rem',
                  color: '#e5e7eb',
                  lineHeight: 1.4,
                  background: 'rgba(15,23,42,0.8)',
                  borderRadius: '10px',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>How to Play</div>
                <ul style={{ paddingLeft: '1.1rem', margin: 0, listStyle: 'disc' }}>
                  <li>Each small 3×3 board is its own mini game.</li>
                  <li>Win a small board by getting three in a row.</li>
                  <li>Winning a board claims that square on the big grid.</li>
                  <li>First to win three boards in a row wins the match.</li>
                  <li>Full or won boards are locked and can&apos;t be played.</li>
                  <li>
                    Your move sends your opponent to the matching small board
                    for their next turn.
                  </li>
                </ul>
              </div>
          </div>
          <div
            style={{
              padding: '0.65rem 0.9rem',
              borderTop: '1px solid #18263b',
            }}
          >
            <button
              type="button"
              onClick={() => setShowTicTacToe(false)}
              style={{
                width: '100%',
                padding: '7px 10px',
                cursor: 'pointer',
                background: 'transparent',
                color: '#e5e7eb',
                border: '1px solid #374151',
                borderRadius: '6px',
                fontSize: '0.75rem',
              }}
            >
              Back to Home Screen
            </button>
          </div>
        </div>

        {/* Right game area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1.75rem',
              background:
                'linear-gradient(90deg, #020617, #111827, #020617)',
              borderBottom: '1px solid #1f2937',
              boxShadow: '0 4px 18px rgba(15,23,42,0.9)',
              fontFamily: '"Press Start 2P", system-ui',
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            <div>Super Tic-Tac-Toe</div>
            <div style={{ fontSize: '0.55rem', color: '#9ca3af' }}>Play vs AI or 2 Players</div>
          </div>

          {/* Board container with optional intro overlay */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
              padding: '1.5rem',
              gap: '1.5rem',
            }}
          >
            {/* Board container */}
            <div
              style={{
                position: 'relative',
                background:
                  'radial-gradient(circle at center, #020617 0, #020617 55%, #000000 100%)',
                borderRadius: '18px',
                padding: '1.5rem 1.75rem 1.4rem',
                border: '3px solid #f97316',
                boxShadow:
                  '0 0 25px rgba(249,115,22,0.9), 0 0 60px rgba(14,165,233,0.5)',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Intro overlay fades in when game just opened */}
              {ticTacToeIntro && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at center, rgba(15,23,42,0.1), rgba(15,23,42,0.98))',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f9fafb',
                    zIndex: 10,
                    animation: 'fadeOutIntro 1.4s ease-out forwards',
                    opacity: 1,
                    transition: 'opacity 0.4s ease-out',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      fontFamily: '"Press Start 2P", system-ui',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      textShadow:
                        '0 0 14px rgba(249,115,22,0.95), 0 0 32px rgba(14,165,233,0.9)',
                    }}
                  >
                    Super Tic-Tac-Toe
                  </div>
                  <div
                    style={{
                      marginTop: '0.9rem',
                      fontSize: '0.75rem',
                      color: '#e5e7eb',
                      fontFamily: '"Rajdhani", system-ui',
                      textAlign: 'center',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Win boards, then win the grid.
                  </div>
                </div>
              )}

              <Tictactoe
                onRegisterControls={setTicTacToeControls}
                onModeChange={(mode) => setTicTacToeMode(mode)}
                onSetMode={(fn) => setSetGameModeFn(() => fn)}
              />
            </div>

            {/* Leaderboard column next to the board */}
            <div
              style={{
                width: '260px',
                alignSelf: 'stretch',
                background: 'rgba(15,23,42,0.95)',
                borderRadius: '14px',
                border: '1px solid rgba(56,189,248,0.7)',
                padding: '1rem 1.1rem',
                boxShadow: '0 0 20px rgba(56,189,248,0.7)',
                color: '#e5e7eb',
                fontFamily: '"Rajdhani", system-ui',
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '0.5rem',
                  color: '#a5f3fc',
                }}
              >
                Leaderboard
              </div>
              {leaderboard.length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  No scores yet. Play vs AI to set the first record!
                </div>
              ) : (
                <ol style={{ listStyle: 'decimal', paddingLeft: '1.25rem', margin: 0, fontSize: '0.8rem' }}>
                  {leaderboard.slice(0, 20).map((entry, idx) => (
                    <li
                      key={entry.username + idx}
                      style={{ marginBottom: '0.25rem' }}
                    >
                      <span style={{ fontWeight: entry.username === user.username ? 700 : 400 }}>
                        {entry.username}
                      </span>
                      {entry.username === user.username && ' (you)'} — Best Streak: {entry.bestStreak}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <div style={{ ...headerStyle, textAlign: 'center' }}>
          <h1 style={welcomeStyle}>Welcome, {user.username}!</h1>
          <p style={subtitleStyle}>Choose a game to play:</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            ...logoutButtonStyle,
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        >
          Log Out
        </button>
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
          onClick={() => {
            setTicTacToeIntro(true);
            setShowTicTacToe(true);
            setTimeout(() => setTicTacToeIntro(false), 2500);
          }}
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

      {/* Leaderboard is now shown inside the TicTacToe view instead of here */}
    </div>
  );
};

export default Home;