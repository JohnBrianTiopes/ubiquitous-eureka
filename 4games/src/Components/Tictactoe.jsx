import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Super (Ultimate) Tic-Tac-Toe with forced-board rule and simple AI.

const EMPTY_SMALL_BOARD = Array(9).fill(null);

const createEmptySuperBoard = () =>
    Array(9)
        .fill(null)
        .map(() => ({
            cells: [...EMPTY_SMALL_BOARD],
            winner: null,
        }));

const winner3x3 = (cells) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            return cells[a];
        }
    }
    return null;
};

const isFull3x3 = (cells) => cells.every((c) => c !== null);

// Core game component (board, AI, scoring)
const TictactoeGame = ({ onRegisterControls, onModeChange, onSetMode }) => {
    const [boards, setBoards] = useState(createEmptySuperBoard());
    const [bigWinners, setBigWinners] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [scoreboard, setScoreboard] = useState({ X: 0, O: 0, draws: 0 });
    const [vsAI, setVsAI] = useState(true);
    const [forcedBoard, setForcedBoard] = useState(null);
    const [hoverPreviewBoard, setHoverPreviewBoard] = useState(null);
    const [difficulty, setDifficulty] = useState(1); // 1,2,3,4,5 difficulty levels
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showOutro, setShowOutro] = useState(false);
    const [outroMessage, setOutroMessage] = useState('');

    const bigWinner = winner3x3(bigWinners);
    const isBigDraw = !bigWinner && bigWinners.every((w, i) => w || isFull3x3(boards[i].cells));

    const allFreeBoards = boards
        .map((b, i) => ({ i, b }))
        .filter(({ b }) => !b.winner && !isFull3x3(b.cells))
        .map(({ i }) => i);

    const playableBoards =
        forcedBoard === null || !allFreeBoards.includes(forcedBoard)
            ? allFreeBoards
            : [forcedBoard];

    const applyMove = (boardIndex, cellIndex, player, curBoards, curBigWinners) => {
        const newBoards = curBoards.map((board, idx) =>
            idx === boardIndex
                ? {
                      ...board,
                      cells: board.cells.map((cell, cIdx) => (cIdx === cellIndex ? player : cell)),
                  }
                : board,
        );

        const small = newBoards[boardIndex];
        let newBigWinners = [...curBigWinners];
        if (!small.winner) {
            const w = winner3x3(small.cells);
            if (w) {
                // mark this small board as won and also update big-board winners
                small.winner = w;
                newBoards[boardIndex] = { ...small };
                newBigWinners[boardIndex] = w;
            } else if (isFull3x3(small.cells)) {
                newBigWinners[boardIndex] = 'D';
            }
        }

        const newBigWinner = winner3x3(newBigWinners);

        const nextForced =
            !newBoards[cellIndex].winner && !isFull3x3(newBoards[cellIndex].cells)
                ? cellIndex
                : null;

        return { newBoards, newBigWinners, newBigWinner, nextForced };
    };

    const finalizeStateAfterMove = (newBoards, newBigWinners, newBigWinner) => {
        // Always commit the latest board state so the final position is visible
        setBoards(newBoards);
        setBigWinners(newBigWinners);

        const superWinner = newBigWinner || winner3x3(newBigWinners);
        const superDraw =
            !superWinner &&
            newBigWinners.every((w, i) => w || isFull3x3(newBoards[i].cells));

        if (superWinner) {
            // trigger stylish outro for wins
            setOutroMessage(
                superWinner === 'X'
                    ? vsAI
                        ? 'You Win!'
                        : 'X Wins!'
                    : vsAI
                        ? 'Bot Wins!'
                        : 'O Wins!',
            );
            setShowOutro(true);
            setTimeout(() => setShowOutro(false), 2600);

            setScoreboard((prev) => ({
                ...prev,
                [superWinner]: prev[superWinner] + 1,
            }));
            if (vsAI && superWinner === 'X') {
                // Player beats the bot: increase streak and difficulty, then auto-reset board
                setStreak((prev) => {
                    const next = prev + 1;
                    setBestStreak((best) => {
                        const updated = next > best ? next : best;

                        // Save best streak per logged-in user to backend
                        try {
                            const storedUser = localStorage.getItem('user');
                            if (storedUser) {
                                const parsed = JSON.parse(storedUser);
                                if (parsed && parsed.token) {
                                    fetch('http://localhost:5000/api/leaderboard/update', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${parsed.token}`,
                                        },
                                        body: JSON.stringify({ bestStreak: updated }),
                                    }).catch(() => {
                                        // fail silently; UI still works even if leaderboard update fails
                                    });
                                }
                            }
                        } catch (e) {
                            // ignore JSON / fetch errors for now
                        }

                        return updated;
                    });
                    setDifficulty((cur) => Math.min(5, cur + 1));
                    return next;
                });

                // start next round automatically at higher difficulty
                setTimeout(() => {
                    setBoards(createEmptySuperBoard());
                    setBigWinners(Array(9).fill(null));
                    setXIsNext(true);
                    setForcedBoard(null);
                }, 300);
            }
            if (vsAI && superWinner === 'O') {
                // Bot wins: freeze board, show leaderboard, reset streak/difficulty
                setShowLeaderboard(true);
                setStreak(0);
                setDifficulty(1);
            }
        } else if (superDraw) {
            // stylish outro for draws
            setOutroMessage('Draw Game!');
            setShowOutro(true);
            setTimeout(() => setShowOutro(false), 2600);

            setScoreboard((prev) => ({
                ...prev,
                draws: prev.draws + 1,
            }));
        }
    };

    const handleCellClick = (boardIndex, cellIndex) => {
        if (bigWinner || isBigDraw) return;

        const board = boards[boardIndex];
        if (board.winner || board.cells[cellIndex]) return;

        const isPlayable = playableBoards.includes(boardIndex);
        if (!isPlayable) return;

        const player = xIsNext ? 'X' : 'O';
        if (vsAI && player === 'O') return;

        const { newBoards, newBigWinners, newBigWinner, nextForced } = applyMove(
            boardIndex,
            cellIndex,
            player,
            boards,
            bigWinners,
        );

        setForcedBoard(nextForced);
        setXIsNext((prev) => !prev);
        finalizeStateAfterMove(newBoards, newBigWinners, newBigWinner);
    };

    const chooseAIMove = (allowedBoards) => {
        const boardIndex =
            forcedBoard !== null && allowedBoards.includes(forcedBoard)
                ? forcedBoard
                : allowedBoards[Math.floor(Math.random() * allowedBoards.length)];

        const board = boards[boardIndex];
        // Extra safety: if this small board already has a 3-in-a-row,
        // treat it as closed for the AI even if winner wasn't recorded yet.
        if (winner3x3(board.cells)) {
            return null;
        }
        const empties = board.cells
            .map((v, idx) => (v === null ? idx : null))
            .filter((v) => v !== null);
        if (empties.length === 0) return null;

        if (difficulty === 1) {
            return { boardIndex, cellIndex: empties[Math.floor(Math.random() * empties.length)] };
        }

        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        const findTacticalMove = (player) => {
            for (const [a, b, c] of lines) {
                const trio = [board.cells[a], board.cells[b], board.cells[c]];
                if (trio.filter((v) => v === player).length === 2 && trio.includes(null)) {
                    const emptyIdx = [a, b, c][trio.indexOf(null)];
                    return emptyIdx;
                }
            }
            return null;
        };

        const winningMove = findTacticalMove('O');
        if (difficulty >= 2 && winningMove !== null) {
            return { boardIndex, cellIndex: winningMove };
        }

        const blockingMove = findTacticalMove('X');
        if (difficulty >= 3 && blockingMove !== null) {
            return { boardIndex, cellIndex: blockingMove };
        }

        // Difficulty 4+: prefer center, then corners; difficulty 5 reduces randomness further
        if (difficulty >= 4) {
            const center = 4;
            if (empties.includes(center)) {
                return { boardIndex, cellIndex: center };
            }

            const corners = [0, 2, 6, 8].filter((i) => empties.includes(i));
            if (corners.length > 0) {
                const chosenCorner =
                    difficulty >= 5 ? corners[0] : corners[Math.floor(Math.random() * corners.length)];
                return { boardIndex, cellIndex: chosenCorner };
            }

            if (difficulty >= 5 && empties.length > 0) {
                // On hardest level, pick the first remaining edge instead of random
                return { boardIndex, cellIndex: empties[0] };
            }
        }

        return { boardIndex, cellIndex: empties[Math.floor(Math.random() * empties.length)] };
    };

    const makeAIMove = () => {
        if (!vsAI || bigWinner || isBigDraw || xIsNext) return;

        const allowedBoards = playableBoards;
        if (allowedBoards.length === 0) return;

        const move = chooseAIMove(allowedBoards);
        if (!move) return;

        const { newBoards, newBigWinners, newBigWinner, nextForced } = applyMove(
            move.boardIndex,
            move.cellIndex,
            'O',
            boards,
            bigWinners,
        );

        setForcedBoard(nextForced);
        setXIsNext(true);
        finalizeStateAfterMove(newBoards, newBigWinners, newBigWinner);
    };

    useEffect(() => {
        makeAIMove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xIsNext, playableBoards.length]);

    const resetGame = () => {
        setBoards(createEmptySuperBoard());
        setBigWinners(Array(9).fill(null));
        setXIsNext(true);
        setForcedBoard(null);
        setShowOutro(false);
    };

    const resetAll = () => {
        resetGame();
        setScoreboard({ X: 0, O: 0, draws: 0 });
        setDifficulty(1);
        setStreak(0);
        setBestStreak(0);
        setShowLeaderboard(false);
        setShowOutro(false);
    };

    // Expose control functions to parent (Home) so buttons can live in sidebar
    useEffect(() => {
        if (onRegisterControls) {
            onRegisterControls({ resetGame, resetAll });
        }
    }, [onRegisterControls]);

    useEffect(() => {
        if (onModeChange) {
            onModeChange(vsAI ? 'ai' : '2p');
        }
    }, [vsAI, onModeChange]);

    useEffect(() => {
        if (onSetMode) {
            onSetMode((mode) => {
                const useAI = mode === 'ai';
                setVsAI(useAI);
                resetGame();
            });
        }
    }, [onSetMode]);

    const status = bigWinner
        ? `Super Winner: ${bigWinner}!`
        : isBigDraw
            ? 'Super Draw!'
            : forcedBoard === null
                ? `Next: ${xIsNext ? 'X' : 'O'} • Play on any free small board`
                : `Next: ${xIsNext ? 'X' : 'O'} • Must play in small board #${forcedBoard + 1} (if available)`;

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
    const containerBoardWidth = Math.min(viewportWidth * 0.7, 480);
    const smallBoardSize = containerBoardWidth / 3 - 6;
    const cellSize = Math.floor(smallBoardSize / 3) - 4;

    const bigBoardStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '4px',
        margin: '0.5rem auto',
        width: `${containerBoardWidth}px`,
        maxWidth: '100%',
    };

    const smallBoardStyle = (winner, index) => {
        const isPlayable = playableBoards.includes(index);
        const isClosed = !!winner || !playableBoards.includes(index);
        const isForced = forcedBoard === index && isPlayable;
        const isPreview = hoverPreviewBoard === index && !isForced && isPlayable;

        return {
            border: isForced
                ? '3px solid #facc15'
                : isPreview
                    ? '3px solid #22d3ee'
                    : isPlayable
                        ? '2px solid #f97316'
                        : '2px solid #4b5563',
            padding: '2px',
            background:
                winner === 'X'
                    ? 'rgba(59,130,246,0.3)'
                    : winner === 'O'
                        ? 'rgba(249,115,22,0.3)'
                        : isForced
                            ? 'rgba(202,138,4,0.25)'
                            : isPreview
                                ? 'rgba(34,211,238,0.25)'
                                : isPlayable
                                    ? 'rgba(17,24,39,0.95)'
                                    : 'rgba(15,23,42,0.6)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px',
            position: 'relative',
            opacity: isClosed && !winner ? 0.5 : 1,
            boxShadow: isForced
                ? '0 0 0 3px rgba(250,204,21,0.8)'
                : isPreview
                    ? '0 0 10px 3px rgba(34,211,238,0.9)'
                    : isPlayable
                        ? '0 0 0 2px rgba(249,115,22,0.5)'
                        : '0 0 0 0 rgba(0,0,0,0)',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, opacity 0.15s ease',
        };
    };

    const cellStyle = (boardIndex, cellIndex) => {
        const board = boards[boardIndex];
        const disabled =
            !!bigWinner ||
            isBigDraw ||
            !!board.winner ||
            !!board.cells[cellIndex] ||
            !playableBoards.includes(boardIndex);

        return {
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            background: disabled ? '#111827' : '#1f2937',
            border: '1px solid #374151',
            color: '#e5e7eb',
            fontSize: Math.max(cellSize / 2.5, 10),
            fontWeight: 'bold',
            cursor: disabled ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px',
            padding: 0,
        };
    };

    return (
        <div
            style={{
                textAlign: 'center',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '100%',
                maxHeight: '100%',
                overflow: 'visible',
                width: '100%',
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0.75rem 0.5rem',
            }}
        >
            <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{status}</div>
            <div style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                Mode: {vsAI ? 'Player (X) vs AI (O)' : 'Two Players (X vs O)'}
            </div>
            <div style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                Super Board — X Wins: {scoreboard.X} • O Wins: {scoreboard.O} • Draws: {scoreboard.draws}
            </div>
            <div style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                Difficulty: {difficulty} | Current Streak vs Bot: {streak} | Best Streak: {bestStreak}
            </div>

            {showLeaderboard && (
                <div
                    style={{
                        marginBottom: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: '#111827',
                        borderRadius: '8px',
                        border: '1px solid #4b5563',
                        maxWidth: '100%',
                    }}
                >
                    <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Leaderboard</div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        Your best win streak against the bot: <strong>{bestStreak}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                        Bot finally won! You can retry from easy difficulty or go back home.
                    </div>
                </div>
            )}

            {showOutro && (
                (() => {
                    const isWin =
                        outroMessage.includes('You Win') ||
                        outroMessage.includes('X Wins');
                    const isLoss =
                        outroMessage.includes('Bot Wins') ||
                        outroMessage.includes('O Wins');

                    const glowColor = isWin
                        ? '0 0 18px rgba(56,189,248,0.95), 0 0 44px rgba(56,189,248,1)'
                        : isLoss
                        ? '0 0 18px rgba(248,113,113,0.95), 0 0 44px rgba(248,113,113,1)'
                        : '0 0 16px rgba(56,189,248,0.95), 0 0 40px rgba(249,115,22,0.9)';

                    return (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background:
                                    'radial-gradient(circle at center, rgba(15,23,42,0.25), rgba(15,23,42,0.96))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 25,
                                pointerEvents: 'none',
                                animation:
                                    'fadeOutOutro 2.3s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
                            }}
                        >
                            <div
                                style={{
                                    textAlign: 'center',
                                    fontFamily: '"Press Start 2P", system-ui',
                                    fontSize: '1.18rem',
                                    letterSpacing: '0.23em',
                                    textTransform: 'uppercase',
                                    color: '#f9fafb',
                                    textShadow: glowColor,
                                    animation: 'outroGlitch 1.4s ease-out',
                                }}
                            >
                                {outroMessage}
                                {!isWin && (
                                    <div
                                        style={{
                                            marginTop: '1.1rem',
                                            fontSize: '0.8rem',
                                            fontFamily: '"Rajdhani", system-ui',
                                            letterSpacing: '0.11em',
                                            textTransform: 'uppercase',
                                            color: '#e5e7eb',
                                            opacity: 0.92,
                                        }}
                                    >
                                        Press reset to play again
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()
            )}

            <div
                style={{
                    flex: '0 1 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    width: '100%',
                    overflow: 'visible',
                    marginTop: '-0.75rem',
                }}
            >
                <div
                    style={{
                        flex: '0 1 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <div style={bigBoardStyle}>
                        {boards.map((b, bIndex) => (
                            <div key={bIndex} style={smallBoardStyle(b.winner, bIndex)}>
                                {b.winner && b.winner !== 'D' && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: Math.max(cellSize * 2, 32),
                                            fontWeight: 'bold',
                                            color: b.winner === 'X' ? '#60a5fa' : '#fb923c',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        {b.winner}
                                    </div>
                                )}
                                {b.cells.map((value, cIndex) => (
                                    <button
                                        key={cIndex}
                                        type="button"
                                        style={cellStyle(bIndex, cIndex)}
                                        onMouseEnter={() => {
                                            // Only show a preview on your valid, clickable cells
                                            if (bigWinner || isBigDraw) {
                                                setHoverPreviewBoard(null);
                                                return;
                                            }

                                            const board = boards[bIndex];
                                            const isPlayableBoard = playableBoards.includes(bIndex);

                                            if (!isPlayableBoard || board.winner || board.cells[cIndex] !== null) {
                                                setHoverPreviewBoard(null);
                                                return;
                                            }

                                            const targetBoardIndex = cIndex;
                                            const targetBoard = boards[targetBoardIndex];

                                            if (
                                                targetBoard &&
                                                !targetBoard.winner &&
                                                !isFull3x3(targetBoard.cells)
                                            ) {
                                                setHoverPreviewBoard(targetBoardIndex);
                                            } else {
                                                setHoverPreviewBoard(null);
                                            }
                                        }}
                                        onMouseLeave={() => setHoverPreviewBoard(null)}
                                        onClick={() => handleCellClick(bIndex, cIndex)}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Full-page arcade shell that wraps the core game
const Tictactoe = () => {
    const [user, setUser] = useState(null);
    const [ticTacToeIntro, setTicTacToeIntro] = useState(true);
    const [ticTacToeControls, setTicTacToeControls] = useState({ resetGame: null, resetAll: null });
    const [ticTacToeMode, setTicTacToeMode] = useState('ai');
    const [setGameModeFn, setSetGameModeFn] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
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

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/leaderboard');
                if (!res.ok) return;
                const data = await res.json();
                setLeaderboard(Array.isArray(data) ? data : []);
            } catch {
                // ignore
            }
        };

        fetchLeaderboard();
        const id = setInterval(fetchLeaderboard, 15000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!ticTacToeIntro) return;
        const id = setTimeout(() => setTicTacToeIntro(false), 2500);
        return () => clearTimeout(id);
    }, [ticTacToeIntro]);

    useEffect(() => {
        document.body.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    if (!user) {
        return null;
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                minHeight: '100vh',
                height: isMobile ? 'auto' : '100vh',
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
                    width: isMobile ? '100%' : '270px',
                    background:
                        'linear-gradient(180deg, #020617 0%, #020617 40%, #020617 100%)',
                    borderRight: isMobile ? 'none' : '1px solid #1f2937',
                    borderBottom: isMobile ? '1px solid #1f2937' : 'none',
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
                            <li>Full or won boards are locked and can't be played.</li>
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
                        onClick={() => navigate('/home')}
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
                        Back to Home
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
                                        animation: 'outroGlitch 1.2s ease-out',
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

                        <TictactoeGame
                            onRegisterControls={setTicTacToeControls}
                            onModeChange={(mode) => setTicTacToeMode(mode)}
                            onSetMode={(fn) => setSetGameModeFn(() => fn)}
                        />
                    </div>

                    {/* Leaderboard column next to the board */}
                    <div
                        style={{
                            width: isMobile ? '100%' : '260px',
                            alignSelf: 'stretch',
                            background: 'rgba(15,23,42,0.95)',
                            borderRadius: '14px',
                            border: '1px solid rgba(56,189,248,0.7)',
                            padding: '1rem 1.1rem',
                            boxShadow: '0 0 20px rgba(56,189,248,0.7)',
                            color: '#e5e7eb',
                            fontFamily: '"Rajdhani", system-ui',
                            marginTop: isMobile ? '1.25rem' : 0,
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
};

export default Tictactoe;