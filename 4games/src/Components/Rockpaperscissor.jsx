import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rockpaperscissor.css';

const Rockpaperscissor = () => {
    const navigate = useNavigate();
    
    const [gameState, setGameState] = useState('roundSelection');
    const [difficulty, setDifficulty] = useState('');
    const [roundLimit, setRoundLimit] = useState(3);
    const [playerChoice, setPlayerChoice] = useState('');
    const [computerChoice, setComputerChoice] = useState('');
    const [result, setResult] = useState('');
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [playerHistory, setPlayerHistory] = useState([]);
    const [computerWins, setComputerWins] = useState(0);
    const [playerWins, setPlayerWins] = useState(0);
    const [playerPatterns, setPlayerPatterns] = useState({});
    const [lastPlayerMove, setLastPlayerMove] = useState('');
    
    // New state for the currently logged-in user
    const [currentUser, setCurrentUser] = useState(null);

    // New state for leaderboard
    const [leaderboard, setLeaderboard] = useState(() => {
        // Load leaderboard from localStorage if available
        const savedLeaderboard = localStorage.getItem('rpsLeaderboard');
        return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
    });

    // Effect to get the current user from localStorage on component mount
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);
    
    // Save leaderboard to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('rpsLeaderboard', JSON.stringify(leaderboard));
    }, [leaderboard]);
    
    // Save to leaderboard when game is over
    useEffect(() => {
        if (gameState === 'gameOver') {
            saveToLeaderboard();
        }
    }, [gameState]);
    
    // Updated function to save game result to leaderboard
    const saveToLeaderboard = () => {
        // Only save if a user is logged in
        if (!currentUser) {
            console.log("Guest score not saved.");
            return;
        }

        const gameResult = {
            id: Date.now(),
            userId: currentUser.userId, // Add userId
            username: currentUser.username, // Add username
            date: new Date().toLocaleDateString(),
            difficulty: difficulty,
            rounds: rounds,
            playerScore: playerScore,
            computerScore: computerScore,
            result: playerScore > computerScore ? 'Win' : playerScore < computerScore ? 'Loss' : 'Tie'
        };
        
        const newLeaderboard = [...leaderboard, gameResult];
        // Sort by player score (descending) and then by date (most recent first)
        newLeaderboard.sort((a, b) => {
            if (a.playerScore !== b.playerScore) {
                return b.playerScore - a.playerScore;
            }
            return new Date(b.date) - new Date(a.date);
        });
        
        // Keep only top 10 scores
        setLeaderboard(newLeaderboard.slice(0, 10));
    };
    
    // New function to clear the leaderboard
    const clearLeaderboard = () => {
        setLeaderboard([]);
    };
    
    // Different choices based on game mode
    const getChoices = () => {
        if (difficulty === 'spock') {
            return ['rock', 'paper', 'scissors', 'lizard', 'spock'];
        }
        return ['rock', 'paper', 'scissors'];
    };
    
    const selectRoundLimit = (limit) => {
        setRoundLimit(limit);
        setGameState('menu');
    };
    
    const selectDifficulty = (level) => {
        setDifficulty(level);
        // If Spock is selected, show the introduction first
        if (level === 'spock') {
            setGameState('spockIntroduction');
        } else {
            setGameState('playing');
            resetGame();
        }
    };
    
    // New function to start the game after the introduction
    const startSpockGame = () => {
        setGameState('playing');
        resetGame();
    };
    
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
    
    const handleChoice = (choice) => {
        if (gameState !== 'playing') return;
        
        setPlayerChoice(choice);
        const compChoice = getComputerChoice(difficulty, choice);
        setComputerChoice(compChoice);
        
        setPlayerHistory([...playerHistory, choice]);
        setLastPlayerMove(choice);
        
        updatePatterns(choice);
        
        const gameResult = determineWinner(choice, compChoice);
        setResult(gameResult);
        
        if (gameResult === 'You Win!') {
            setPlayerScore(playerScore + 1);
            setPlayerWins(playerWins + 1);
        } else if (gameResult === 'Computer Wins!') {
            setComputerScore(computerScore + 1);
            setComputerWins(computerWins + 1);
        }
        
        setRounds(rounds + 1);
        
        if (roundLimit !== 'unlimited' && rounds + 1 >= roundLimit) {
            setGameState('gameOver');
        } else {
            setGameState('result');
        }
    };
    
    const updatePatterns = (choice) => {
        if (playerHistory.length > 0) {
            const lastMove = playerHistory[playerHistory.length - 1];
            if (!playerPatterns[lastMove]) {
                const choices = getChoices();
                playerPatterns[lastMove] = {};
                choices.forEach(c => {
                    playerPatterns[lastMove][c] = 0;
                });
            }
            playerPatterns[lastMove][choice]++;
            setPlayerPatterns({...playerPatterns});
        }
    };
    
    // Advanced AI logic shared between 'hard' and 'spock' modes
    const getAdvancedComputerChoice = (playerChoice) => {
        const choices = getChoices();
        
        if (playerHistory.length > 0) {
            if (Math.random() < 0.99) {
                for (let patternLength = Math.min(playerHistory.length, 6); patternLength > 2; patternLength--) {
                    const recentPattern = playerHistory.slice(-patternLength).join('-');
                    const patternMatches = [];
                    
                    for (let j = 0; j < playerHistory.length - patternLength; j++) {
                        if (playerHistory.slice(j, j + patternLength).join('-') === recentPattern) {
                            if (j + patternLength < playerHistory.length) {
                                patternMatches.push(playerHistory[j + patternLength]);
                            }
                        }
                    }
                    
                    if (patternMatches.length > 1) {
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
            
            if (Math.random() < 0.98) {
                if (computerWins > playerWins * 1.5) {
                    return getCounterChoice(lastPlayerMove || playerChoice);
                } else {
                    const prediction = getAdvancedPrediction();
                    if (prediction) {
                        return getCounterChoice(prediction);
                    }
                }
            }
            
            if (Math.random() < 0.95) {
                const emotionalState = analyzeEmotionalState();
                if (emotionalState.predictedMove) {
                    return getCounterChoice(emotionalState.predictedMove);
                }
            }
            
            if (Math.random() < 0.95) {
                const frequency = {};
                const recentMoves = playerHistory.slice(-7);
                recentMoves.forEach((choice, index) => {
                    const weight = (index + 1) / recentMoves.length;
                    frequency[choice] = (frequency[choice] || 0) + weight;
                });
                
                let mostFrequent = choices[0];
                let maxWeight = 0;
                for (const choice in frequency) {
                    if (frequency[choice] > maxWeight) {
                        maxWeight = frequency[choice];
                        mostFrequent = choice;
                    }
                }
                
                return getCounterChoice(mostFrequent);
            }
            
            if (playerHistory.length > 4 && Math.random() < 0.9) {
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
            
            if (playerHistory.length > 3 && Math.random() < 0.85) {
                const ourLastMoves = [];
                for (let i = 1; i < Math.min(4, playerHistory.length); i++) {
                    ourLastMoves.push(getCounterChoice(playerHistory[playerHistory.length - i]));
                }
                
                const playerMoveCounters = playerHistory.map(move => getCounterChoice(move));
                const isCountering = playerMoveCounters.some(counter => 
                    ourLastMoves.includes(counter)
                );
                
                if (isCountering) {
                    return choices[Math.floor(Math.random() * choices.length)];
                }
            }
            
            if (Math.random() < 0.8) {
                if (computerScore > playerScore) {
                    const desperateMove = getCounterChoice(playerChoice);
                    return getCounterChoice(desperateMove);
                } else {
                    return getCounterChoice(lastPlayerMove || playerChoice);
                }
            }
        }
        return choices[Math.floor(Math.random() * choices.length)];
    };
    
    const getComputerChoice = (level, playerChoice) => {
        const choices = getChoices();
        
        switch (level) {
            case 'easy':
                return choices[Math.floor(Math.random() * choices.length)];
                
            case 'medium':
                if (playerHistory.length > 0) {
                    if (Math.random() < 0.99) {
                        return getCounterChoice(lastPlayerMove || playerChoice);
                    }
                    
                    if (Object.keys(playerPatterns).length > 0 && Math.random() < 0.98) {
                        const lastMove = playerHistory[playerHistory.length - 1];
                        if (playerPatterns[lastMove]) {
                            let mostLikely = choices[0];
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
                    
                    if (Math.random() < 0.95) {
                        const frequency = {};
                        const recentMoves = playerHistory.slice(-5);
                        recentMoves.forEach(choice => {
                            frequency[choice] = (frequency[choice] || 0) + 1;
                        });
                        
                        let mostFrequent = choices[0];
                        let maxCount = 0;
                        for (const choice in frequency) {
                            if (frequency[choice] > maxCount) {
                                maxCount = frequency[choice];
                                mostFrequent = choice;
                            }
                        }
                        
                        return getCounterChoice(mostFrequent);
                    }
                    
                    if (playerHistory.length > 2 && Math.random() < 0.95) {
                        const lastThree = playerHistory.slice(-3);
                        const isRotating = (lastThree[0] !== lastThree[1] && 
                                          lastThree[1] !== lastThree[2] && 
                                          lastThree[0] !== lastThree[2]);
                        
                        if (isRotating) {
                            const rotationOrder = choices;
                            const lastIndex = rotationOrder.indexOf(lastThree[2]);
                            const nextInRotation = rotationOrder[(lastIndex + 1) % rotationOrder.length];
                            return getCounterChoice(nextInRotation);
                        }
                    }
                    
                    if (playerHistory.length > 1 && Math.random() < 0.9) {
                        const lastTwo = playerHistory.slice(-2);
                        if (lastTwo[0] === lastTwo[1]) {
                            const counterToRepeat = getCounterChoice(lastTwo[0]);
                            return getCounterChoice(counterToRepeat);
                        }
                    }
                    
                    if (playerHistory.length > 3 && Math.random() < 0.85) {
                        const winPattern = analyzeWinPattern();
                        if (winPattern.nextMove) {
                            return getCounterChoice(winPattern.nextMove);
                        }
                    }
                    
                    if (playerHistory.length > 2 && Math.random() < 0.8) {
                        const predictedOurMove = getCounterChoice(lastPlayerMove);
                        const counterToOurCounter = getCounterChoice(predictedOurMove);
                        return counterToOurCounter;
                    }
                }
                return choices[Math.floor(Math.random() * choices.length)];
                
            case 'hard':
            case 'spock':
                // Use the shared advanced AI logic for both hard and spock modes
                return getAdvancedComputerChoice(playerChoice);
                
            default:
                return choices[Math.floor(Math.random() * choices.length)];
        }
    };
    
    const analyzeEmotionalState = () => {
        if (playerHistory.length < 3) return { predictedMove: null };
        
        const recentResults = [];
        for (let i = playerHistory.length - 1; i >= Math.max(0, playerHistory.length - 3); i--) {
            if (i > 0) {
                const playerPrevChoice = playerHistory[i - 1];
                const playerCurrChoice = playerHistory[i];
                
                if (playerPrevChoice !== playerCurrChoice) {
                    const switchPattern = [getCounterChoice(playerPrevChoice), getCounterChoice(playerCurrChoice)];
                    const nextSwitch = switchPattern[Math.floor(Math.random() * switchPattern.length)];
                    return { predictedMove: nextSwitch };
                }
            }
        }
        
        const lastThree = playerHistory.slice(-3);
        if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) {
            return { predictedMove: getCounterChoice(lastThree[0]) };
        }
        
        return { predictedMove: null };
    };
    
    const analyzeWinPattern = () => {
        if (playerHistory.length < 4) return { nextMove: null };
        
        const patterns = { afterWin: {}, afterLoss: {} };
        const choices = getChoices();
        
        for (let i = 1; i < playerHistory.length; i++) {
            const prevMove = playerHistory[i - 1];
            const currMove = playerHistory[i];
            
            const didWin = determineWinner(prevMove, getComputerChoice('medium', prevMove)) === 'You Win!';
            const key = didWin ? 'afterWin' : 'afterLoss';
            
            if (!patterns[key][currMove]) {
                patterns[key][currMove] = 0;
            }
            patterns[key][currMove]++;
        }
        
        const lastResult = determineWinner(playerHistory[playerHistory.length - 2], getComputerChoice('medium', playerHistory[playerHistory.length - 2]));
        if (lastResult === 'You Win!') {
            const lastWinningMove = playerHistory[playerHistory.length - 2];
            if (patterns.afterWin[lastWinningMove]) {
                return { nextMove: lastWinningMove };
            }
        } else {
            const lastLosingMove = playerHistory[playerHistory.length - 2];
            const switches = choices.filter(choice => choice !== lastLosingMove);
            if (switches.length > 0) {
                return { nextMove: switches[Math.floor(Math.random() * switches.length)] };
            }
        }
        
        return { nextMove: null };
    };
    
    const getAdvancedPrediction = () => {
        if (playerHistory.length < 3) return null;
        
        const predictions = [];
        const choices = getChoices();
        
        const weights = [0.6, 0.3, 0.1];
        const weightedFreq = {};
        choices.forEach(choice => {
            weightedFreq[choice] = 0;
        });
        
        for (let i = 0; i < Math.min(4, playerHistory.length); i++) {
            const move = playerHistory[playerHistory.length - 1 - i];
            weightedFreq[move] += weights[i];
        }
        
        let maxWeight = 0;
        let weightedPrediction = choices[0];
        for (const move in weightedFreq) {
            if (weightedFreq[move] > maxWeight) {
                maxWeight = weightedFreq[move];
                weightedPrediction = move;
            }
        }
        predictions.push(weightedPrediction);
        
        if (playerHistory.length > 5) {
            const lastThree = playerHistory.slice(-3).join('-');
            for (let i = 0; i < playerHistory.length - 3; i++) {
                if (playerHistory.slice(i, i + 3).join('-') === lastThree) {
                    if (i + 3 < playerHistory.length) {
                        predictions.push(playerHistory[i + 3]);
                    }
                }
            }
        }
        
        if (playerHistory.length > 2) {
            const lastMove = playerHistory[playerHistory.length - 1];
            const antiPattern = getCounterChoice(getCounterChoice(lastMove));
            predictions.push(antiPattern);
        }
        
        if (playerHistory.length > 4) {
            const rhythm = detectPlayerRhythm();
            if (rhythm.nextMove) {
                predictions.push(rhythm.nextMove);
            }
        }
        
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
    
    const detectPlayerRhythm = () => {
        if (playerHistory.length < 5) return { nextMove: null };
        
        const lastFive = playerHistory.slice(-5);
        const patterns = [];
        
        for (let length = 2; length <= 3; length++) {
            for (let i = 0; i <= lastFive.length - length; i++) {
                const pattern = lastFive.slice(i, i + length).join('-');
                const nextMoves = [];
                
                for (let j = i + length; j < lastFive.length - length; j++) {
                    if (lastFive.slice(j, j + length).join('-') === pattern) {
                        if (j + length < lastFive.length) {
                            nextMoves.push(lastFive[j + length]);
                        }
                    }
                }
                
                if (nextMoves.length > 1) {
                    const freq = {};
                    nextMoves.forEach(move => {
                        freq[move] = (freq[move] || 0) + 1;
                    });
                    
                    const mostCommon = Object.keys(freq).reduce((a, b) => 
                        freq[a] > freq[b] ? a : b
                    );
                    
                    return { nextMove: mostCommon };
                }
            }
        }
        
        return { nextMove: null };
    };
    
    const getCounterChoice = (choice) => {
        // For standard RPS
        if (difficulty !== 'spock') {
            switch (choice) {
                case 'rock':
                    return 'paper';
                case 'paper':
                    return 'scissors';
                case 'scissors':
                    return 'rock';
                default:
                    const choices = getChoices();
                    return choices[Math.floor(Math.random() * choices.length)];
            }
        } 
        // For RPSLS
        else {
            switch (choice) {
                case 'rock':
                    // Paper covers rock, Spock vaporizes rock
                    return Math.random() < 0.5 ? 'paper' : 'spock';
                case 'paper':
                    // Scissors cuts paper, Lizard eats paper
                    return Math.random() < 0.5 ? 'scissors' : 'lizard';
                case 'scissors':
                    // Rock crushes scissors, Spock smashes scissors
                    return Math.random() < 0.5 ? 'rock' : 'spock';
                case 'lizard':
                    // Rock crushes lizard, Scissors decapitates lizard
                    return Math.random() < 0.5 ? 'rock' : 'scissors';
                case 'spock':
                    // Paper disproves spock, Lizard poisons spock
                    return Math.random() < 0.5 ? 'paper' : 'lizard';
                default:
                    const choices = getChoices();
                    return choices[Math.floor(Math.random() * choices.length)];
            }
        }
    };
    
    const determineWinner = (player, computer) => {
        if (player === computer) return "It's a Tie!";
        
        // Standard RPS rules
        if (difficulty !== 'spock') {
            if (
                (player === 'rock' && computer === 'scissors') ||
                (player === 'paper' && computer === 'rock') ||
                (player === 'scissors' && computer === 'paper')
            ) {
                return 'You Win!';
            }
            
            return 'Computer Wins!';
        } 
        // RPSLS rules
        else {
            // Scissors cuts Paper
            if (player === 'scissors' && computer === 'paper') return 'You Win!';
            if (player === 'paper' && computer === 'scissors') return 'Computer Wins!';
            
            // Paper covers Rock
            if (player === 'paper' && computer === 'rock') return 'You Win!';
            if (player === 'rock' && computer === 'paper') return 'Computer Wins!';
            
            // Rock crushes Lizard
            if (player === 'rock' && computer === 'lizard') return 'You Win!';
            if (player === 'lizard' && computer === 'rock') return 'Computer Wins!';
            
            // Lizard poisons Spock
            if (player === 'lizard' && computer === 'spock') return 'You Win!';
            if (player === 'spock' && computer === 'lizard') return 'Computer Wins!';
            
            // Spock smashes Scissors
            if (player === 'spock' && computer === 'scissors') return 'You Win!';
            if (player === 'scissors' && computer === 'spock') return 'Computer Wins!';
            
            // Scissors decapitates Lizard
            if (player === 'scissors' && computer === 'lizard') return 'You Win!';
            if (player === 'lizard' && computer === 'scissors') return 'Computer Wins!';
            
            // Lizard eats Paper
            if (player === 'lizard' && computer === 'paper') return 'You Win!';
            if (player === 'paper' && computer === 'lizard') return 'Computer Wins!';
            
            // Paper disproves Spock
            if (player === 'paper' && computer === 'spock') return 'You Win!';
            if (player === 'spock' && computer === 'paper') return 'Computer Wins!';
            
            // Spock vaporizes Rock
            if (player === 'spock' && computer === 'rock') return 'You Win!';
            if (player === 'rock' && computer === 'spock') return 'Computer Wins!';
            
            // Rock crushes Scissors
            if (player === 'rock' && computer === 'scissors') return 'You Win!';
            if (player === 'scissors' && computer === 'rock') return 'Computer Wins!';
        }
    };
    
    const playAgain = () => {
        setPlayerChoice('');
        setComputerChoice('');
        setResult('');
        setGameState('playing');
    };
    
    const nextRound = () => {
        setPlayerChoice('');
        setComputerChoice('');
        setResult('');
        setGameState('playing');
    };
    
    const backToMenu = () => {
        setGameState('menu');
        resetGame();
    };
    
    const backToRoundSelection = () => {
        setGameState('roundSelection');
        resetGame();
    };
    
    const startNewGame = () => {
        resetGame();
        setGameState('playing');
    };
    
    // Simplified Emoji Icon Component
    const EmojiIcon = ({ choice }) => {
        const choiceEmojis = {
            rock: '✊',
            paper: '✋',
            scissors: '✌️',
            lizard: '🦎',
            spock: '🖖'
        };

        return (
            <div className="emoji-icon">
                {choiceEmojis[choice]}
            </div>
        );
    };
    
    const renderGame = () => {
        if (gameState === 'roundSelection') {
            return (
                <div className="game-container round-selection">
                    <div className="game-frame">
                        <div className="pixel-border"></div>
                        
                        <h1 className="game-title">ROCK PAPER SCISSORS</h1>
                        <h2 className="section-title">SELECT ROUND LIMIT</h2>
                        <div className="button-group">
                            <button onClick={() => selectRoundLimit(3)} className="game-button">
                                Best of 3
                            </button>
                            <button onClick={() => selectRoundLimit(5)} className="game-button">
                                Best of 5
                            </button>
                            <button onClick={() => selectRoundLimit(10)} className="game-button">
                                Best of 10
                            </button>
                            <button onClick={() => selectRoundLimit('unlimited')} className="game-button">
                                Unlimited
                            </button>
                        </div>
                        <div className="button-group secondary">
                            <button onClick={() => setGameState('leaderboard')} className="secondary-button">
                                View Leaderboard
                            </button>
                            <button onClick={() => navigate('/home')} className="secondary-button">
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (gameState === 'menu') {
            return (
                <div className="game-container menu">
                    <div className="game-frame">
                        <div className="pixel-border"></div>
                        
                        <h1 className="game-title">ROCK PAPER SCISSORS</h1>
                        <h2 className="section-title">SELECT DIFFICULTY</h2>
                        <p className="round-info">
                            Round Limit: {roundLimit === 'unlimited' ? 'Unlimited' : `Best of ${roundLimit}`}
                        </p>
                        <div className="button-group">
                            <button onClick={() => selectDifficulty('easy')} className="game-button easy">
                                Easy
                            </button>
                            <button onClick={() => selectDifficulty('medium')} className="game-button medium">
                                Medium
                            </button>
                            <button onClick={() => selectDifficulty('hard')} className="game-button hard">
                                Hard
                            </button>
                            <button onClick={() => selectDifficulty('spock')} className="game-button spock">
                                Spock
                            </button>
                        </div>
                        <div className="button-group secondary">
                            <button onClick={() => setGameState('leaderboard')} className="secondary-button">
                                View Leaderboard
                            </button>
                            <button onClick={backToRoundSelection} className="secondary-button">
                                Change Round Limit
                            </button>
                            <button onClick={() => navigate('/home')} className="secondary-button">
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (gameState === 'spockIntroduction') {
            return (
                <div className="game-container spock-introduction">
                    <div className="game-frame">
                        <div className="pixel-border"></div>
                        
                        <h1 className="game-title">ROCK PAPER SCISSORS LIZARD SPOCK</h1>
                        <h2 className="section-title">INTRODUCTION</h2>
                        
                        <div className="introduction-content">
                            <p className="introduction-text">
                                Rock, Paper, Scissors, Lizard, Spock is a game of chance that expands the traditional game of Rock, Paper, Scissors. It is first used to settle a dispute about what to watch on TV between Sheldon and Raj in "The Lizard-Spock Extension".
                            </p>
                            <p className="introduction-text">
                                The game is an expansion on the game Rock, Paper, Scissors, with the additional hand signs of Lizard (resembling a hand puppet), and Spock (the Vulcan Salute). Each player picks a variable and reveals it at the same time. The winner is the one who defeats the others. In a tie, the process is repeated until a winner is found.
                            </p>
                            
                            <h3 className="rules-title">RULES:</h3>
                            <div className="rules-list">
                                <div className="rule-item">Scissors cuts Paper</div>
                                <div className="rule-item">Paper covers Rock</div>
                                <div className="rule-item">Rock crushes Lizard</div>
                                <div className="rule-item">Lizard poisons Spock</div>
                                <div className="rule-item">Spock smashes Scissors</div>
                                <div className="rule-item">Scissors decapitates Lizard</div>
                                <div className="rule-item">Lizard eats Paper</div>
                                <div className="rule-item">Paper disproves Spock</div>
                                <div className="rule-item">Spock vaporizes Rock</div>
                                <div className="rule-item">(and as it always has) Rock crushes Scissors</div>
                            </div>
                            
                            <div className="video-container">
                                <h3 className="video-title">Watch The Big Bang Theory explain the rules:</h3>
                                <div className="video-wrapper">
                                    <iframe 
                                        src="https://www.youtube.com/embed/_PUEoDYpUyQ?controls=0" 
                                        title="Rock Paper Scissors Lizard Spock" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        className="rules-video"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                        
                        <div className="button-group">
                            <button onClick={startSpockGame} className="game-button spock">
                                Start Game
                            </button>
                            <button onClick={backToMenu} className="back-button">
                                Back to Menu
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (gameState === 'playing') {
            const choices = getChoices();
            const isSpockMode = difficulty === 'spock';
            
            return (
                <div className="game-container playing">
                    <div className="game-frame">
                        <div className="pixel-border"></div>
                        
                        <h1 className="game-title">{isSpockMode ? 'ROCK PAPER SCISSORS LIZARD SPOCK' : 'ROCK PAPER SCISSORS'}</h1>
                        <h2 className="section-title">
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} MODE
                        </h2>
                        
                        {isSpockMode && (
                            <div className="rules-reference">
                                <h3 className="rules-title">Game Rules:</h3>
                                <div className="rules-image-container">
                                    <img 
                                        src="https://wowo.dk/wp-content/uploads/2014/03/rockpaper2.jpg" 
                                        alt="Rock Paper Scissors Lizard Spock Rules" 
                                        className="rules-image"
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div className="score-container">
                            <div className="score-box player-score">
                                <h3>PLAYER: {playerScore}</h3>
                            </div>
                            <div className="score-box round-info">
                                <h3>ROUND: {rounds}{roundLimit !== 'unlimited' ? `/${roundLimit}` : ''}</h3>
                            </div>
                            <div className="score-box computer-score">
                                <h3>COMPUTER: {computerScore}</h3>
                            </div>
                        </div>
                        <h2 className="section-title">MAKE YOUR CHOICE:</h2>
                        <div className={`choices-container ${isSpockMode ? 'five-choices' : ''}`}>
                            {choices.map(choice => (
                                <div key={choice} className="choice-container">
                                    <button onClick={() => handleChoice(choice)} className="choice-button">
                                        <EmojiIcon choice={choice} />
                                    </button>
                                    <div className="choice-label">
                                        {choice}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={backToMenu} className="back-button">
                            Back to Menu
                        </button>
                    </div>
                </div>
            );
        } else if (gameState === 'result') {
            const isSpockMode = difficulty === 'spock';
            
            return (
                <div className="game-container result">
                    <div className="game-frame">
                        <div className="pixel-border"></div>
                        
                        <h1 className="game-title">{isSpockMode ? 'ROCK PAPER SCISSORS LIZARD SPOCK' : 'ROCK PAPER SCISSORS'}</h1>
                        <h2 className="section-title">
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} MODE
                        </h2>
                        <div className="score-container">
                            <div className="score-box player-score">
                                <h3>PLAYER: {playerScore}</h3>
                            </div>
                            <div className="score-box round-info">
                                <h3>ROUND: {rounds}{roundLimit !== 'unlimited' ? `/${roundLimit}` : ''}</h3>
                            </div>
                            <div className="score-box computer-score">
                                <h3>COMPUTER: {computerScore}</h3>
                            </div>
                        </div>
                        <h2 className="section-title">YOU CHOSE:</h2>
                        <div className="result-container">
                            <div className="player-choice">
                                <h3>YOU CHOSE:</h3>
                                <div className="choice-display">
                                    <EmojiIcon choice={playerChoice} />
                                    <div className="choice-name">{playerChoice}</div>
                                </div>
                            </div>
                            <div className="computer-choice">
                                <h3>COMPUTER CHOSE:</h3>
                                <div className="choice-display">
                                    <EmojiIcon choice={computerChoice} />
                                    <div className="choice-name">{computerChoice}</div>
                                </div>
                            </div>
                        </div>
                        <div className="button-group">
                            <button onClick={nextRound} className="game-button">
                                Next Round
                            </button>
                            <button onClick={backToMenu} className="game-button">
                                Change Difficulty
                            </button>
                        </div>
                        <h2 className={`result-text ${result === 'You Win!' ? 'win' : result === 'Computer Wins!' ? 'lose' : 'tie'}`}>
                            {result}
                        </h2>
                    </div>
                </div>
            );
        } else if (gameState === 'gameOver') {
            const isSpockMode = difficulty === 'spock';
            const finalResult = playerScore > computerScore ? 'You Win Game!' : 
                              playerScore < computerScore ? 'Computer Wins Game!' : 
                              "It's a Tie Game!";
            
            return (
                <div className="game-container game-over">
                    <div className="game-frame">
                        <div className="pixel-border"></div>
                        
                        <h1 className="game-title">{isSpockMode ? 'ROCK PAPER SCISSORS LIZARD SPOCK' : 'ROCK PAPER SCISSORS'}</h1>
                        <h2 className={`final-result ${finalResult === 'You Win Game!' ? 'win' : finalResult === 'Computer Wins Game!' ? 'lose' : 'tie'}`}>
                            {finalResult}
                        </h2>
                        <div className="final-scores">
                            <div>
                                <h3>FINAL SCORE</h3>
                                <div className="final-score player">
                                    PLAYER: {playerScore}
                                </div>
                            </div>
                            <div>
                                <h3>FINAL SCORE</h3>
                                <div className="final-score computer">
                                    COMPUTER: {computerScore}
                                </div>
                            </div>
                        </div>
                        <div className="button-group">
                            <button onClick={startNewGame} className="game-button">
                                Play Again
                            </button>
                            <button onClick={() => setGameState('leaderboard')} className="game-button">
                                View Leaderboard
                            </button>
                            <button onClick={backToMenu} className="game-button">
                                Change Difficulty
                            </button>
                            <button onClick={backToRoundSelection} className="game-button">
                                Change Round Limit
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (gameState === 'leaderboard') {
            return (
                <div className="game-container leaderboard">
                    <div className="game-frame">
                        <div className="pixel-border"></div>
                        
                        <h1 className="game-title">LEADERBOARD</h1>
                        
                        {leaderboard.length === 0 ? (
                            <div className="no-scores">
                                <p>No scores yet. Play a game to get on the leaderboard!</p>
                            </div>
                        ) : (
                            <div className="leaderboard-table">
                                <div className="table-header">
                                    <div className="table-cell rank">Rank</div>
                                    <div className="table-cell player">Player</div>
                                    <div className="table-cell date">Date</div>
                                    <div className="table-cell difficulty">Difficulty</div>
                                    <div className="table-cell rounds">Rounds</div>
                                    <div className="table-cell score">Score</div>
                                    <div className="table-cell result">Result</div>
                                </div>
                                {leaderboard.map((entry, index) => (
                                    <div key={entry.id} className="table-row">
                                        <div className="table-cell rank">{index + 1}</div>
                                        <div className="table-cell player">{entry.username}</div>
                                        <div className="table-cell date">{entry.date}</div>
                                        <div className="table-cell difficulty">{entry.difficulty}</div>
                                        <div className="table-cell rounds">{entry.rounds}</div>
                                        <div className="table-cell score">{entry.playerScore} - {entry.computerScore}</div>
                                        <div className={`table-cell result ${entry.result.toLowerCase()}`}>{entry.result}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="button-group">
                            <button onClick={backToMenu} className="game-button">
                                Back to Menu
                            </button>
                            {leaderboard.length > 0 && (
                                <button onClick={clearLeaderboard} className="game-button danger">
                                    Clear Leaderboard
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    };
    
    return renderGame();
};

export default Rockpaperscissor;