import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//Rockpaperscissor ang name
const Rockpaperscissor = () => {
    const navigate = useNavigate();
    
    const [gameState, setGameState] = useState('roundSelection'); // 'roundSelection', 'menu', 'playing', 'result', 'gameOver'
    const [difficulty, setDifficulty] = useState('');
    const [roundLimit, setRoundLimit] = useState(3); // round category hehe 3, 5, 10, or 'unlimited'
    const [playerChoice, setPlayerChoice] = useState('');
    const [computerChoice, setComputerChoice] = useState('');
    const [result, setResult] = useState('');
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [playerHistory, setPlayerHistory] = useState([]);
    const [computerWins, setComputerWins] = useState(0); // Track ng comp wins
    const [playerWins, setPlayerWins] = useState(0); // Track ng player wins
    const [playerPatterns, setPlayerPatterns] = useState({}); // Store detected patterns, para sa difficulty
    const [lastPlayerMove, setLastPlayerMove] = useState(''); // Track last move ng player
    
    const choices = ['rock', 'paper', 'scissors'];
    
    // Handle round limit selection, set ng round limit
    const selectRoundLimit = (limit) => {
        setRoundLimit(limit);
        setGameState('menu');
    };
    
    // Handle difficulty selection
    const selectDifficulty = (level) => {
        setDifficulty(level);
        setGameState('playing');
        resetGame();
    };
    
    // Reset game
    const resetGame = () => {
        setPlayerChoice('');
        setComputerChoice('');
        setResult('');
        setPlayerScore(0);
        setComputerScore(0);
        setRounds(0);
        setPlayerHistory([]);
        setComputerWins(0);
        setPlayerWins(0);
        setPlayerPatterns({});
        setLastPlayerMove('');
    };
    
    // Handle player choice
    const handleChoice = (choice) => {
        if (gameState !== 'playing') return;
        
        setPlayerChoice(choice);
        const compChoice = getComputerChoice(difficulty, choice);
        setComputerChoice(compChoice);
        
        // Update player history for strategy
        setPlayerHistory([...playerHistory, choice]);
        setLastPlayerMove(choice);
        
        // Update patterns database
        updatePatterns(choice);
        
        // Determine winner
        const gameResult = determineWinner(choice, compChoice);
        setResult(gameResult);
        
        // Update scores
        if (gameResult === 'You Win!') {
            setPlayerScore(playerScore + 1);
            setPlayerWins(playerWins + 1);
        } else if (gameResult === 'Computer Wins!') {
            setComputerScore(computerScore + 1);
            setComputerWins(computerWins + 1);
        }
        
        setRounds(rounds + 1);
        
        // Check if game should end based on round limit
        if (roundLimit !== 'unlimited' && rounds + 1 >= roundLimit) {
            setGameState('gameOver');
        } else {
            setGameState('result');
        }
    };
    
    // Update player patterns for learning
    const updatePatterns = (choice) => {
        if (playerHistory.length > 0) {
            const lastMove = playerHistory[playerHistory.length - 1];
            if (!playerPatterns[lastMove]) {
                playerPatterns[lastMove] = { rock: 0, paper: 0, scissors: 0 };
            }
            playerPatterns[lastMove][choice]++;
            setPlayerPatterns({...playerPatterns});
        }
    };
    
    // Get computer choice based on difficulty
    const getComputerChoice = (level, playerChoice) => {
        switch (level) {
            case 'easy':
                // Completely random
                return choices[Math.floor(Math.random() * 3)];
                
            case 'medium':
                // Ultra-competitive medium difficulty
                if (playerHistory.length > 0) {
                    // Strategy 1: Immediate counter to last move (95% chance)
                    if (Math.random() < 0.95) {
                        return getCounterChoice(lastPlayerMove || playerChoice);
                    }
                    
                    // Strategy 2: Exploit detected patterns (90% chance)
                    if (Object.keys(playerPatterns).length > 0 && Math.random() < 0.9) {
                        const lastMove = playerHistory[playerHistory.length - 1];
                        if (playerPatterns[lastMove]) {
                            let mostLikely = 'rock';
                            let maxCount = 0;
                            
                            for (const choice in playerPatterns[lastMove]) {
                                if (playerPatterns[lastMove][choice] > maxCount) {
                                    maxCount = playerPatterns[lastMove][choice];
                                    mostLikely = choice;
                                }
                            }
                            
                            return getCounterChoice(mostLikely);
                        }
                    }
                    
                    // Strategy 3: Frequency domination (85% chance)
                    const frequency = {};
                    playerHistory.forEach(choice => {
                        frequency[choice] = (frequency[choice] || 0) + 1;
                    });
                    
                    let mostFrequent = playerHistory[0];
                    for (const choice in frequency) {
                        if (frequency[choice] > frequency[mostFrequent]) {
                            mostFrequent = choice;
                        }
                    }
                    
                    if (Math.random() < 0.85) {
                        return getCounterChoice(mostFrequent);
                    }
                    
                    // Strategy 4: Anti-rotation strategy (80% chance)
                    if (playerHistory.length > 2 && Math.random() < 0.8) {
                        const lastThree = playerHistory.slice(-3);
                        const isRotating = (lastThree[0] !== lastThree[1] && 
                                          lastThree[1] !== lastThree[2] && 
                                          lastThree[0] !== lastThree[2]);
                        
                        if (isRotating) {
                            // Player is rotating, predict next in rotation
                            const rotationOrder = ['rock', 'paper', 'scissors'];
                            const lastIndex = rotationOrder.indexOf(lastThree[2]);
                            const nextInRotation = rotationOrder[(lastIndex + 1) % 3];
                            return getCounterChoice(nextInRotation);
                        }
                    }
                    
                    // Strategy 5: Predict breaker (75% chance)
                    if (playerHistory.length > 1 && Math.random() < 0.75) {
                        const lastTwo = playerHistory.slice(-2);
                        if (lastTwo[0] === lastTwo[1]) {
                            // Player repeated, likely to break pattern
                            const counterToRepeat = getCounterChoice(lastTwo[0]);
                            return getCounterChoice(counterToRepeat);
                        }
                    }
                }
                return choices[Math.floor(Math.random() * 3)];
                
            case 'hard':
                // Nearly unbeatable hard difficulty with predictive dominance
                if (playerHistory.length > 0) {
                    // Strategy 1: Guaranteed win in specific situations (99% chance)
                    if (Math.random() < 0.99) {
                        // Check if we can force a win based on patterns
                        for (let i = Math.min(playerHistory.length, 5); i > 0; i--) {
                            const recentPattern = playerHistory.slice(-i).join('-');
                            const patternMatches = [];
                            
                            for (let j = 0; j < playerHistory.length - i; j++) {
                                if (playerHistory.slice(j, j + i).join('-') === recentPattern) {
                                    if (j + i < playerHistory.length) {
                                        patternMatches.push(playerHistory[j + i]);
                                    }
                                }
                            }
                            
                            if (patternMatches.length > 0) {
                                // Find the most common next move after this pattern
                                const frequency = {};
                                patternMatches.forEach(move => {
                                    frequency[move] = (frequency[move] || 0) + 1;
                                });
                                
                                let mostLikely = patternMatches[0];
                                let maxCount = 0;
                                for (const move in frequency) {
                                    if (frequency[move] > maxCount) {
                                        maxCount = frequency[move];
                                        mostLikely = move;
                                    }
                                }
                                
                                return getCounterChoice(mostLikely);
                            }
                        }
                    }
                    
                    // Strategy 2: Meta-learning adaptation (95% chance)
                    if (Math.random() < 0.95) {
                        // Analyze what strategies have worked against this player
                        if (computerWins > playerWins * 1.5) {
                            // We're dominating, continue aggressive play
                            return getCounterChoice(lastPlayerMove || playerChoice);
                        } else {
                            // Need to adapt, use complex prediction
                            const prediction = getAdvancedPrediction();
                            if (prediction) {
                                return getCounterChoice(prediction);
                            }
                        }
                    }
                    
                    // Strategy 3: Psychological warfare (90% chance)
                    if (Math.random() < 0.9) {
                        // Analyze player's emotional state based on history
                        const recentResults = [];
                        for (let i = playerHistory.length - 1; i >= Math.max(0, playerHistory.length - 3); i--) {
                            // Simplified emotional analysis
                            if (i > 0) {
                                const playerPrevChoice = playerHistory[i - 1];
                                const playerCurrChoice = playerHistory[i];
                                
                                // If player switched after losing, they're frustrated
                                if (playerPrevChoice !== playerCurrChoice) {
                                    // Predict they'll continue switching
                                    const counterToSwitch = getCounterChoice(playerChoice);
                                    return getCounterChoice(counterToSwitch);
                                }
                            }
                        }
                    }
                    
                    // Strategy 4: Strategic sequence prediction (85% chance)
                    if (playerHistory.length > 4 && Math.random() < 0.85) {
                        // Look for strategic sequences (not just patterns)
                        const sequences = {};
                        for (let i = 0; i < playerHistory.length - 2; i++) {
                            const seq = playerHistory.slice(i, i + 3).join(',');
                            if (!sequences[seq]) {
                                sequences[seq] = [];
                            }
                            if (i + 3 < playerHistory.length) {
                                sequences[seq].push(playerHistory[i + 3]);
                            }
                        }
                        
                        const recentSeq = playerHistory.slice(-3).join(',');
                        if (sequences[recentSeq] && sequences[recentSeq].length > 0) {
                            const freq = {};
                            sequences[recentSeq].forEach(move => {
                                freq[move] = (freq[move] || 0) + 1;
                            });
                            
                            let mostLikely = sequences[recentSeq][0];
                            let maxCount = 0;
                            for (const move in freq) {
                                if (freq[move] > maxCount) {
                                    maxCount = freq[move];
                                    mostLikely = move;
                                }
                            }
                            
                            return getCounterChoice(mostLikely);
                        }
                    }
                    
                    // Strategy 5: Dominance play (80% chance)
                    if (Math.random() < 0.8) {
                        // If we're ahead, play conservatively but smart
                        if (computerScore > playerScore) {
                            // Predict player's desperate move
                            const desperateMove = getCounterChoice(playerChoice);
                            return getCounterChoice(desperateMove);
                        } else {
                            // Play aggressively to catch up
                            return getCounterChoice(lastPlayerMove || playerChoice);
                        }
                    }
                }
                return choices[Math.floor(Math.random() * 3)];
                
            default:
                return choices[Math.floor(Math.random() * 3)];
        }
    };
    
    // Advanced prediction for hard mode
    const getAdvancedPrediction = () => {
        if (playerHistory.length < 3) return null;
        
        // Multiple prediction models
        const predictions = [];
        
        // Model 1: Weighted frequency
        const weights = [0.5, 0.3, 0.2]; // More weight to recent moves
        const weightedFreq = { rock: 0, paper: 0, scissors: 0 };
        
        for (let i = 0; i < Math.min(3, playerHistory.length); i++) {
            const move = playerHistory[playerHistory.length - 1 - i];
            weightedFreq[move] += weights[i];
        }
        
        let maxWeight = 0;
        let weightedPrediction = 'rock';
        for (const move in weightedFreq) {
            if (weightedFreq[move] > maxWeight) {
                maxWeight = weightedFreq[move];
                weightedPrediction = move;
            }
        }
        predictions.push(weightedPrediction);
        
        // Model 2: Pattern-based prediction
        if (playerHistory.length > 4) {
            const lastTwo = playerHistory.slice(-2).join('-');
            for (let i = 0; i < playerHistory.length - 2; i++) {
                if (playerHistory.slice(i, i + 2).join('-') === lastTwo) {
                    if (i + 2 < playerHistory.length) {
                        predictions.push(playerHistory[i + 2]);
                    }
                }
            }
        }
        
        // Model 3: Anti-pattern prediction
        if (playerHistory.length > 2) {
            const lastMove = playerHistory[playerHistory.length - 1];
            const antiPattern = getCounterChoice(getCounterChoice(lastMove));
            predictions.push(antiPattern);
        }
        
        // Combine predictions
        if (predictions.length > 0) {
            const freq = {};
            predictions.forEach(pred => {
                freq[pred] = (freq[pred] || 0) + 1;
            });
            
            let mostPredicted = predictions[0];
            let maxCount = 0;
            for (const pred in freq) {
                if (freq[pred] > maxCount) {
                    maxCount = freq[pred];
                    mostPredicted = pred;
                }
            }
            
            return mostPredicted;
        }
        
        return null;
    };
    
    // Get the choice that beats the given choice
    const getCounterChoice = (choice) => {
        switch (choice) {
            case 'rock':
                return 'paper';
            case 'paper':
                return 'scissors';
            case 'scissors':
                return 'rock';
            default:
                return choices[Math.floor(Math.random() * 3)];
        }
    };
    
    // Determine the winner
    const determineWinner = (player, computer) => {
        if (player === computer) return "It's a Tie!";
        
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'You Win!';
        }
        
        return 'Computer Wins!';
    };
    
    // Play another round
    const playAgain = () => {
        setPlayerChoice('');
        setComputerChoice('');
        setResult('');
        setGameState('playing');
    };
    
    // Continue to next round
    const nextRound = () => {
        setPlayerChoice('');
        setComputerChoice('');
        setResult('');
        setGameState('playing');
    };
    
    // Go back to menu
    const backToMenu = () => {
        setGameState('menu');
        resetGame();
    };
    
    // Go back to round selection
    const backToRoundSelection = () => {
        setGameState('roundSelection');
        resetGame();
    };
    
    // Start new game with same settings
    const startNewGame = () => {
        resetGame();
        setGameState('playing');
    };
    
    // Pixel art style component for choice icons
    const PixelIcon = ({ choice, size = 80 }) => {
        if (choice === 'rock') {
            return (
                <div style={{ 
                    width: `${size}px`, 
                    height: `${size}px`, 
                    backgroundColor: '#8B7355',
                    border: '3px solid #5C4033',
                    position: 'relative',
                    imageRendering: 'pixelated'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '15%',
                        left: '15%',
                        width: '70%',
                        height: '70%',
                        backgroundColor: '#A0826D',
                        border: '2px solid #5C4033'
                    }}></div>
                </div>
            );
        } else if (choice === 'paper') {
            return (
                <div style={{ 
                    width: `${size}px`, 
                    height: `${size}px`, 
                    backgroundColor: '#F5F5DC',
                    border: '3px solid #D3D3D3',
                    position: 'relative',
                    imageRendering: 'pixelated'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: '80%',
                        height: '80%',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #D3D3D3'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        top: '30%',
                        left: '20%',
                        width: '60%',
                        height: '5%',
                        backgroundColor: '#D3D3D3'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        top: '45%',
                        left: '20%',
                        width: '60%',
                        height: '5%',
                        backgroundColor: '#D3D3D3'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        top: '60%',
                        left: '20%',
                        width: '60%',
                        height: '5%',
                        backgroundColor: '#D3D3D3'
                    }}></div>
                </div>
            );
        } else if (choice === 'scissors') {
            return (
                <div style={{ 
                    width: `${size}px`, 
                    height: `${size}px`, 
                    position: 'relative',
                    imageRendering: 'pixelated'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '35%',
                        width: '30%',
                        height: '60%',
                        backgroundColor: '#C0C0C0',
                        border: '3px solid #808080',
                        transform: 'rotate(45deg)',
                        transformOrigin: 'center'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '35%',
                        width: '30%',
                        height: '60%',
                        backgroundColor: '#C0C0C0',
                        border: '3px solid #808080',
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'center'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        top: '60%',
                        left: '40%',
                        width: '20%',
                        height: '20%',
                        backgroundColor: '#696969',
                        border: '2px solid #2F4F4F'
                    }}></div>
                </div>
            );
        }
        return null;
    };
    
    // Render game based on state
    const renderGame = () => {
        if (gameState === 'roundSelection') {
            return (
                <div style={{
                    width: '100vw',
                    height: '100vh',
                    backgroundImage: `url('https://i.pinimg.com/736x/a9/b8/cf/a9b8cf03aafc0ed58b542e03d281dd2f.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    fontFamily: 'monospace',
                    color: '#eee',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Game content with retro pixel frame */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        backgroundColor: 'rgba(25, 25, 112, 0.85)',
                        border: '8px solid #000',
                        borderRadius: '0px',
                        padding: '30px',
                        textAlign: 'center',
                        boxShadow: '0 0 0 4px #444, 0 0 0 8px #666',
                        imageRendering: 'pixelated',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Pixel border decoration */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            right: '10px',
                            bottom: '10px',
                            border: '2px solid #aaa',
                            pointerEvents: 'none'
                        }}></div>
                        
                        <h1 style={{
                            fontSize: '32px',
                            marginBottom: '20px',
                            color: '#ffcc00',
                            textShadow: '3px 3px 0 #000',
                            letterSpacing: '3px',
                            fontWeight: 'bold'
                        }}>
                            ROCK PAPER SCISSORS
                        </h1>
                        <h2 style={{
                            fontSize: '24px',
                            marginBottom: '30px',
                            color: '#fff',
                            textShadow: '2px 2px 0 #000'
                        }}>
                            SELECT ROUND LIMIT
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
                            <button 
                                onClick={() => selectRoundLimit(3)} 
                                style={{ 
                                    padding: '15px 20px', 
                                    cursor: 'pointer', 
                                    background: '#1e3a8a', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Best of 3
                            </button>
                            <button 
                                onClick={() => selectRoundLimit(5)} 
                                style={{ 
                                    padding: '15px 20px', 
                                    cursor: 'pointer', 
                                    background: '#1e3a8a', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Best of 5
                            </button>
                            <button 
                                onClick={() => selectRoundLimit(10)} 
                                style={{ 
                                    padding: '15px 20px', 
                                    cursor: 'pointer', 
                                    background: '#1e3a8a', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Best of 10
                            </button>
                            <button 
                                onClick={() => selectRoundLimit('unlimited')} 
                                style={{ 
                                    padding: '15px 20px', 
                                    cursor: 'pointer', 
                                    background: '#1e3a8a', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Unlimited
                            </button>
                        </div>
                        <button 
                            onClick={() => navigate('/home')} 
                            style={{ 
                                marginTop: '30px',
                                padding: '10px 15px', 
                                cursor: 'pointer', 
                                background: '#ff5252', 
                                color: 'white', 
                                border: '4px solid #000',
                                borderRadius: '0px',
                                fontFamily: 'monospace',
                                boxShadow: '4px 4px 0 #000',
                                transition: 'all 0.1s',
                                textTransform: 'uppercase'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translate(2px, 2px)';
                                e.target.style.boxShadow = '2px 2px 0 #000';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translate(0, 0)';
                                e.target.style.boxShadow = '4px 4px 0 #000';
                            }}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            );
        } else if (gameState === 'menu') {
            return (
                <div style={{
                    width: '100vw',
                    height: '100vh',
                    backgroundImage: `url('https://i.pinimg.com/736x/a9/b8/cf/a9b8cf03aafc0ed58b542e03d281dd2f.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    fontFamily: 'monospace',
                    color: '#eee',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Game content with retro pixel frame */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        backgroundColor: 'rgba(25, 25, 112, 0.85)',
                        border: '8px solid #000',
                        borderRadius: '0px',
                        padding: '30px',
                        textAlign: 'center',
                        boxShadow: '0 0 0 4px #444, 0 0 0 8px #666',
                        imageRendering: 'pixelated',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Pixel border decoration */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            right: '10px',
                            bottom: '10px',
                            border: '2px solid #aaa',
                            pointerEvents: 'none'
                        }}></div>
                        
                        <h1 style={{
                            fontSize: '32px',
                            marginBottom: '20px',
                            color: '#ffcc00',
                            textShadow: '3px 3px 0 #000',
                            letterSpacing: '3px',
                            fontWeight: 'bold'
                        }}>
                            ROCK PAPER SCISSORS
                        </h1>
                        <h2 style={{
                            fontSize: '24px',
                            marginBottom: '15px',
                            color: '#fff',
                            textShadow: '2px 2px 0 #000'
                        }}>
                            SELECT DIFFICULTY
                        </h2>
                        <p style={{
                            fontSize: '18px',
                            marginBottom: '30px',
                            color: '#ddd',
                            textShadow: '1px 1px 0 #000'
                        }}>
                            Round Limit: {roundLimit === 'unlimited' ? 'Unlimited' : `Best of ${roundLimit}`}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                            <button 
                                onClick={() => selectDifficulty('easy')} 
                                style={{ 
                                    padding: '15px 20px', 
                                    cursor: 'pointer', 
                                    background: '#4caf50', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Easy
                            </button>
                            <button 
                                onClick={() => selectDifficulty('medium')} 
                                style={{ 
                                    padding: '15px 20px', 
                                    cursor: 'pointer', 
                                    background: '#ff9800', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Medium
                            </button>
                            <button 
                                onClick={() => selectDifficulty('hard')} 
                                style={{ 
                                    padding: '15px 20px', 
                                    cursor: 'pointer', 
                                    background: '#f44336', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Hard
                            </button>
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <button 
                                onClick={backToRoundSelection} 
                                style={{ 
                                    padding: '10px 15px', 
                                    cursor: 'pointer', 
                                    background: '#7e57c2', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Change Round Limit
                            </button>
                            <button 
                                onClick={() => navigate('/home')} 
                                style={{ 
                                    padding: '10px 15px', 
                                    cursor: 'pointer', 
                                    background: '#ff5252', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (gameState === 'playing') {
            return (
                <div style={{
                    width: '100vw',
                    height: '100vh',
                    backgroundImage: `url('https://i.pinimg.com/736x/a9/b8/cf/a9b8cf03aafc0ed58b542e03d281dd2f.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    fontFamily: 'monospace',
                    color: '#eee',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Game content with retro pixel frame */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        backgroundColor: 'rgba(25, 25, 112, 0.85)',
                        border: '8px solid #000',
                        borderRadius: '0px',
                        padding: '30px',
                        textAlign: 'center',
                        boxShadow: '0 0 0 4px #444, 0 0 0 8px #666',
                        imageRendering: 'pixelated',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Pixel border decoration */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            right: '10px',
                            bottom: '10px',
                            border: '2px solid #aaa',
                            pointerEvents: 'none'
                        }}></div>
                        
                        <h1 style={{
                            fontSize: '32px',
                            marginBottom: '20px',
                            color: '#ffcc00',
                            textShadow: '3px 3px 0 #000',
                            letterSpacing: '3px',
                            fontWeight: 'bold'
                        }}>
                            ROCK PAPER SCISSORS
                        </h1>
                        <h2 style={{
                            fontSize: '24px',
                            marginBottom: '15px',
                            color: '#fff',
                            textShadow: '2px 2px 0 #000'
                        }}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} MODE
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                            <div style={{
                                padding: '10px 15px',
                                backgroundColor: 'rgba(76, 175, 80, 0.7)',
                                border: '4px solid #000',
                                borderRadius: '0px',
                                boxShadow: '4px 4px 0 #000'
                            }}>
                                <h3 style={{ textShadow: '1px 1px 0 #000' }}>PLAYER: {playerScore}</h3>
                            </div>
                            <div style={{
                                padding: '10px 15px',
                                backgroundColor: 'rgba(255, 152, 0, 0.7)',
                                border: '4px solid #000',
                                borderRadius: '0px',
                                boxShadow: '4px 4px 0 #000'
                            }}>
                                <h3 style={{ textShadow: '1px 1px 0 #000' }}>ROUND: {rounds}{roundLimit !== 'unlimited' ? `/${roundLimit}` : ''}</h3>
                            </div>
                            <div style={{
                                padding: '10px 15px',
                                backgroundColor: 'rgba(244, 67, 54, 0.7)',
                                border: '4px solid #000',
                                borderRadius: '0px',
                                boxShadow: '4px 4px 0 #000'
                            }}>
                                <h3 style={{ textShadow: '1px 1px 0 #000' }}>COMPUTER: {computerScore}</h3>
                            </div>
                        </div>
                        <h2 style={{
                            fontSize: '24px',
                            marginBottom: '30px',
                            color: '#fff',
                            textShadow: '2px 2px 0 #000'
                        }}>
                            MAKE YOUR CHOICE:
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' }}>
                            {choices.map(choice => (
                                <div key={choice} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <button 
                                        onClick={() => handleChoice(choice)} 
                                        style={{ 
                                            padding: '15px',
                                            cursor: 'pointer', 
                                            background: 'transparent', 
                                            color: 'white', 
                                            border: 'none',
                                            position: 'relative',
                                            transition: 'all 0.1s'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-5px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <PixelIcon choice={choice} size={100} />
                                    </button>
                                    <div style={{
                                        marginTop: '10px',
                                        padding: '8px 15px',
                                        backgroundColor: '#1e3a8a',
                                        border: '4px solid #000',
                                        borderRadius: '0px',
                                        textTransform: 'capitalize',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        fontFamily: 'monospace',
                                        boxShadow: '4px 4px 0 #000',
                                        textShadow: '1px 1px 0 #000'
                                    }}>
                                        {choice}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={backToMenu} 
                            style={{ 
                                marginTop: '30px',
                                padding: '10px 15px', 
                                cursor: 'pointer', 
                                background: '#ff5252', 
                                color: 'white', 
                                border: '4px solid #000',
                                borderRadius: '0px',
                                fontFamily: 'monospace',
                                boxShadow: '4px 4px 0 #000',
                                transition: 'all 0.1s',
                                textTransform: 'uppercase'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translate(2px, 2px)';
                                e.target.style.boxShadow = '2px 2px 0 #000';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translate(0, 0)';
                                e.target.style.boxShadow = '4px 4px 0 #000';
                            }}
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            );
        } else if (gameState === 'result') {
            return (
                <div style={{
                    width: '100vw',
                    height: '100vh',
                    backgroundImage: `url('https://i.pinimg.com/736x/a9/b8/cf/a9b8cf03aafc0ed58b542e03d281dd2f.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    fontFamily: 'monospace',
                    color: '#eee',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Game content with retro pixel frame */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        backgroundColor: 'rgba(25, 25, 112, 0.85)',
                        border: '8px solid #000',
                        borderRadius: '0px',
                        padding: '30px',
                        textAlign: 'center',
                        boxShadow: '0 0 0 4px #444, 0 0 0 8px #666',
                        imageRendering: 'pixelated',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Pixel border decoration */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            right: '10px',
                            bottom: '10px',
                            border: '2px solid #aaa',
                            pointerEvents: 'none'
                        }}></div>
                        
                        <h1 style={{
                            fontSize: '32px',
                            marginBottom: '20px',
                            color: '#ffcc00',
                            textShadow: '3px 3px 0 #000',
                            letterSpacing: '3px',
                            fontWeight: 'bold'
                        }}>
                            ROCK PAPER SCISSORS
                        </h1>
                        <h2 style={{
                            fontSize: '24px',
                            marginBottom: '15px',
                            color: '#fff',
                            textShadow: '2px 2px 0 #000'
                        }}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} MODE
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                            <div style={{
                                padding: '10px 15px',
                                backgroundColor: 'rgba(76, 175, 80, 0.7)',
                                border: '4px solid #000',
                                borderRadius: '0px',
                                boxShadow: '4px 4px 0 #000'
                            }}>
                                <h3 style={{ textShadow: '1px 1px 0 #000' }}>PLAYER: {playerScore}</h3>
                            </div>
                            <div style={{
                                padding: '10px 15px',
                                backgroundColor: 'rgba(255, 152, 0, 0.7)',
                                border: '4px solid #000',
                                borderRadius: '0px',
                                boxShadow: '4px 4px 0 #000'
                            }}>
                                <h3 style={{ textShadow: '1px 1px 0 #000' }}>ROUND: {rounds}{roundLimit !== 'unlimited' ? `/${roundLimit}` : ''}</h3>
                            </div>
                            <div style={{
                                padding: '10px 15px',
                                backgroundColor: 'rgba(244, 67, 54, 0.7)',
                                border: '4px solid #000',
                                borderRadius: '0px',
                                boxShadow: '4px 4px 0 #000'
                            }}>
                                <h3 style={{ textShadow: '1px 1px 0 #000' }}>COMPUTER: {computerScore}</h3>
                            </div>
                        </div>
                        <div style={{ margin: '30px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px' }}>
                                <div>
                                    <h3 style={{ marginBottom: '10px', textShadow: '2px 2px 0 #000' }}>YOU CHOSE:</h3>
                                    <div style={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '20px', 
                                        backgroundColor: 'rgba(76, 175, 80, 0.7)', 
                                        border: '4px solid #000',
                                        borderRadius: '0px',
                                        boxShadow: '4px 4px 0 #000'
                                    }}>
                                        <PixelIcon choice={playerChoice} size={80} />
                                        <div style={{
                                            marginTop: '10px',
                                            textTransform: 'capitalize',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            textShadow: '1px 1px 0 #000'
                                        }}>
                                            {playerChoice}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '10px', textShadow: '2px 2px 0 #000' }}>COMPUTER CHOSE:</h3>
                                    <div style={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '20px', 
                                        backgroundColor: 'rgba(244, 67, 54, 0.7)', 
                                        border: '4px solid #000',
                                        borderRadius: '0px',
                                        boxShadow: '4px 4px 0 #000'
                                    }}>
                                        <PixelIcon choice={computerChoice} size={80} />
                                        <div style={{
                                            marginTop: '10px',
                                            textTransform: 'capitalize',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            textShadow: '1px 1px 0 #000'
                                        }}>
                                            {computerChoice}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 style={{ 
                                margin: '30px 0',
                                fontSize: '32px',
                                color: result === 'You Win!' ? '#4caf50' : result === 'Computer Wins!' ? '#f44336' : '#ff9800',
                                textShadow: '3px 3px 0 #000',
                                fontWeight: 'bold'
                            }}>
                                {result}
                            </h2>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                            <button 
                                onClick={nextRound} 
                                style={{ 
                                    padding: '10px 15px', 
                                    cursor: 'pointer', 
                                    background: '#4caf50', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Next Round
                            </button>
                            <button 
                                onClick={playAgain} 
                                style={{ 
                                    padding: '10px 15px', 
                                    cursor: 'pointer', 
                                    background: '#2196f3', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Play Again
                            </button>
                            <button 
                                onClick={backToMenu} 
                                style={{ 
                                    padding: '10px 15px', 
                                    cursor: 'pointer', 
                                    background: '#7e57c2', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Change Difficulty
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (gameState === 'gameOver') {
            const finalResult = playerScore > computerScore ? 'You Win the Game!' : 
                              playerScore < computerScore ? 'Computer Wins the Game!' : 
                              "It's a Tie Game!";
            
            return (
                <div style={{
                    width: '100vw',
                    height: '100vh',
                    backgroundImage: `url('https://i.pinimg.com/736x/a9/b8/cf/a9b8cf03aafc0ed58b542e03d281dd2f.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    fontFamily: 'monospace',
                    color: '#eee',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Game content with retro pixel frame */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        backgroundColor: 'rgba(25, 25, 112, 0.85)',
                        border: '8px solid #000',
                        borderRadius: '0px',
                        padding: '30px',
                        textAlign: 'center',
                        boxShadow: '0 0 0 4px #444, 0 0 0 8px #666',
                        imageRendering: 'pixelated',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Pixel border decoration */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            right: '10px',
                            bottom: '10px',
                            border: '2px solid #aaa',
                            pointerEvents: 'none'
                        }}></div>
                        
                        <h1 style={{
                            fontSize: '32px',
                            marginBottom: '20px',
                            color: '#ffcc00',
                            textShadow: '3px 3px 0 #000',
                            letterSpacing: '3px',
                            fontWeight: 'bold'
                        }}>
                            GAME OVER
                        </h1>
                        <h2 style={{ 
                            margin: '30px 0',
                            fontSize: '32px',
                            color: finalResult === 'You Win the Game!' ? '#4caf50' : 
                                   finalResult === 'Computer Wins the Game!' ? '#f44336' : 
                                   '#ff9800',
                            textShadow: '3px 3px 0 #000',
                            fontWeight: 'bold'
                        }}>
                            {finalResult}
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', margin: '30px 0' }}>
                            <div>
                                <h3 style={{ marginBottom: '10px', textShadow: '2px 2px 0 #000' }}>FINAL SCORE</h3>
                                <div style={{ 
                                    padding: '20px', 
                                    backgroundColor: 'rgba(76, 175, 80, 0.7)', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    marginTop: '10px',
                                    boxShadow: '4px 4px 0 #000',
                                    textShadow: '1px 1px 0 #000'
                                }}>
                                    PLAYER: {playerScore}
                                </div>
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '10px', textShadow: '2px 2px 0 #000' }}>FINAL SCORE</h3>
                                <div style={{ 
                                    padding: '20px', 
                                    backgroundColor: 'rgba(244, 67, 54, 0.7)', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    marginTop: '10px',
                                    boxShadow: '4px 4px 0 #000',
                                    textShadow: '1px 1px 0 #000'
                                }}>
                                    COMPUTER: {computerScore}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                            <button 
                                onClick={startNewGame} 
                                style={{ 
                                    padding: '10px 15px', 
                                    cursor: 'pointer', 
                                    background: '#4caf50', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Play Again
                            </button>
                            <button 
                                onClick={backToMenu} 
                                style={{ 
                                    padding: '10px 15px', 
                                    cursor: 'pointer', 
                                    background: '#7e57c2', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Change Difficulty
                            </button>
                            <button 
                                onClick={backToRoundSelection} 
                                style={{ 
                                    padding: '10px 15px', 
                                    cursor: 'pointer', 
                                    background: '#ff5252', 
                                    color: 'white', 
                                    border: '4px solid #000',
                                    borderRadius: '0px',
                                    fontFamily: 'monospace',
                                    boxShadow: '4px 4px 0 #000',
                                    transition: 'all 0.1s',
                                    textTransform: 'uppercase'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translate(2px, 2px)';
                                    e.target.style.boxShadow = '2px 2px 0 #000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translate(0, 0)';
                                    e.target.style.boxShadow = '4px 4px 0 #000';
                                }}
                            >
                                Change Round Limit
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    };
    
    return renderGame();
};

export default Rockpaperscissor;