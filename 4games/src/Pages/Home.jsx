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
    return <div>Loading...</div>;
  }

  if (showTicTacToe) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          background: '#020617',
          color: '#fff',
          overflow: 'hidden',
        }}
      >
        {/* Left sidebar styled like player panel */}
        <div
          style={{
            width: '260px',
            background: '#243b53',
            borderRight: '1px solid #18263b',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '0.75rem 0.9rem',
              borderBottom: '1px solid #18263b',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#ef4444',
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
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.username}</div>
              <div style={{ fontSize: '0.75rem', color: '#e5e7eb' }}>Rookie</div>
              <div
                style={{
                  marginTop: '0.25rem',
                  width: '100%',
                  height: '4px',
                  borderRadius: '999px',
                  background: '#111827',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '15%',
                    height: '100%',
                    background: '#10b981',
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: '0.55rem', color: '#e5e7eb', marginLeft: '0.4rem' }}>LVL 0</div>
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
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: ticTacToeMode === 'ai' ? 'none' : '1px solid #9ca3af',
                  background: ticTacToeMode === 'ai' ? '#f97316' : 'transparent',
                  color: ticTacToeMode === 'ai' ? '#ffffff' : '#e5e7eb',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
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
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: ticTacToeMode === '2p' ? 'none' : '1px solid #9ca3af',
                  background: ticTacToeMode === '2p' ? '#f97316' : 'transparent',
                  color: ticTacToeMode === '2p' ? '#ffffff' : '#e5e7eb',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
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
                padding: '8px 16px',
                cursor: 'pointer',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
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
                padding: '8px 16px',
                cursor: 'pointer',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
              }}
            >
              Reset & Clear Scores
            </button>
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
              padding: '0 1.5rem',
              background: '#111827',
              borderBottom: '1px solid #1f2937',
            }}
          >
            <div style={{ fontSize: '0.95rem' }}>Super Tic-Tac-Toe</div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Play vs AI or 2 Players</div>
          </div>

          {/* Board container with optional intro overlay */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                position: 'relative',
                background: '#0f172a',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem 1.25rem',
                border: '3px solid #f97316',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
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
                      'radial-gradient(circle at center, rgba(249,115,22,0.18), rgba(15,23,42,0.98))',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f9fafb',
                    zIndex: 10,
                    animation: 'fadeOutIntro 1.1s ease-out forwards',
                  }}
                >
                  <div style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    SUPER TIC-TAC-TOE
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#e5e7eb' }}>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <h1 style={{ textAlign: 'center' }}>Welcome, {user.username}!</h1>
      <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '2rem' }}>
        Choose a game to play:
      </p>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {/* Left: games dashboard */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minWidth: '260px',
            maxWidth: '320px',
          }}
        >
          <button
            style={{
              padding: '20px 30px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              background: '#1d4ed8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              transition: 'background-color 0.3s, transform 0.2s',
            }}
            onClick={() => navigate('/rockpaperscissor')}
          >
            Rock Paper Scissors
          </button>
          <button
            style={{
              padding: '20px 30px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              transition: 'background-color 0.3s, transform 0.2s',
            }}
            type="button"
            onClick={() => {
              setTicTacToeIntro(true);
              setShowTicTacToe(true);
              setTimeout(() => setTicTacToeIntro(false), 1200);
            }}
          >
            Tic-Tac-Toe
          </button>
          <button
            style={{
              padding: '20px 30px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              background: '#6d28d9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              transition: 'background-color 0.3s, transform 0.2s',
            }}
            onClick={() => navigate('/memorygame')}
          >
            Memory Game
          </button>
          <button
            style={{
              padding: '20px 30px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              transition: 'background-color 0.3s, transform 0.2s',
            }}
            onClick={() => navigate('/quizgame')}
          >
            Quiz Game
          </button>
        </div>

        {/* Right: leaderboard outside the dashboard */}
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            background: '#020617',
            borderRadius: '12px',
            border: '1px solid #1f2937',
            padding: '1rem 1.25rem',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Tic-Tac-Toe Leaderboard</div>
          {leaderboard.length === 0 ? (
            <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
              No scores yet. Play vs AI to set the first record!
            </div>
          ) : (
            <ol style={{ listStyle: 'decimal', paddingLeft: '1.25rem', margin: 0 }}>
              {leaderboard.map((entry, idx) => (
                <li
                  key={entry.username + idx}
                  style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}
                >
                  <span style={{ fontWeight: entry.username === user.username ? 600 : 400 }}>
                    {entry.username}
                  </span>
                  {entry.username === user.username && ' (you)'} — Best Streak: {entry.bestStreak}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleLogout}
          style={{
            marginTop: '3rem',
            padding: '10px 15px',
            cursor: 'pointer',
            background: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;