import { useEffect, useState } from 'react';
import './Memorygame.css';
import { useNavigate } from 'react-router-dom';
import cutesong from '/audio/cute_song.wav';

const cardImages=[
    {"src":"/images/01.png", matched:false},
    {"src":"/images/02.png", matched:false},
    {"src":"/images/03.png", matched:false},
    {"src":"/images/04.png", matched:false},
    {"src":"/images/05.png", matched:false},
    {"src":"/images/06.png", matched:false},
    {"src":"/images/07.png", matched:false},
    {"src":"/images/08.png", matched:false},
]

const audioelement = new Audio (cutesong);

function Memorygame() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [isWon, setIsWon] = useState(false);
    const [isPlaying, setIsPlaying] = useState(0);
    const [startGame, setStartGame] = useState(false);
    const [boardleader, setBoardleader] = useState(() => {
        const savedscore = localStorage.getItem('mgleaderboard');
        return savedscore ? JSON.parse(savedscore) : [];
    });

    // Load current user (for attaching names to leaderboard entries)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('user');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch {
            setUser(null);
        }
    }, []);

    // Ensure background music stops and resets when leaving this page
    useEffect(() => {
        return () => {
            audioelement.pause();
            audioelement.currentTime = 0;
        };
    }, []);

    const shuffleCards = () => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({...card, id: Math.random() }))
        setChoiceOne(null)
        setChoiceTwo(null)
        setCards(shuffledCards)
        setTurns(0)
        setMatchedPairs(0)
    }

    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
    }

    useEffect(() => {
        if(choiceOne && choiceTwo) {
            setDisabled(true)
            if(choiceOne.src === choiceTwo.src) {
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if(card.src === choiceOne.src){
                            return{...card, matched:true}
                        } else {
                            return card;
                        }
                    })
                })
                setMatchedPairs(prevMatchedPairs => prevMatchedPairs + 1);
                resetTurn();
            } else {
                setTimeout(() => resetTurn(), 1000)
            }
        }
    }, [choiceOne, choiceTwo]);

    const resetTurn = () => {
        setChoiceOne(null)
        setChoiceTwo(null)
        setTurns(prevTurns => prevTurns + 1)
        setDisabled(false)
    }

    const gamestart = () => {
        setStartGame(true)
    }

    useEffect(() => {
        if(matchedPairs === 8){
            setTimeout(() => setIsWon(true), 1000)
            const newEntry = {
                username: user?.username || 'Anonymous',
                turns,
                date: new Date().toLocaleString(),
            };
            setBoardleader((prev) => {
                const updated = [...prev, newEntry]
                    .sort((a, b) => a.turns - b.turns)
                    .slice(0, 10);
                localStorage.setItem("mgleaderboard", JSON.stringify(updated));
                return updated;
            });
        }
    }, [matchedPairs, turns, user]);

    useEffect(() => {
        if(startGame){
            setTimeout(() => shuffleCards(), 1000)
        }
    }, [startGame]);

    const playpause = () => {
        setIsPlaying(prevIsPlaying => prevIsPlaying+ 1);
    }

    useEffect(() => {
        if(isPlaying % 2 === 0){
            audioelement.pause();
        } else {
            audioelement.play();
        }
    }, [isPlaying]);

    if(!startGame){
        return (
            <div className='contain'>
                <div className='top'>
                    <h2> Super cutesy memory game!</h2>
                    <p> to test your super cutesy memory!</p>
                </div>

                <div className='sidebar'>
                    <div className='howto'>
                        <h4> HOW TO PLAY THE GAME?</h4>
                        <li>Click on the card to flip it and reveal the picture</li>
                        <li>Find all the matching pairs in the grid</li>
                        <li>Aim to get all pairs in the least amount of turns</li>
                        <li>Pray and hope you aren't showing early signs of dementia</li>
                    </div>

                    <div className='boardleader'>
                        <h4 className='boardleader-title'>Who has the most terrible memory:</h4>
                        {boardleader.length === 0 ? (
                            <p style={{fontSize:'12px', marginTop:'6rem'}}>No scores yet...Did you forget to play?</p>
                        ) : (
                            boardleader.map((entry, i) => (
                                <div style={{marginTop: '5px'}} key={i}>
                                    <span>
                                        {i + 1}. {entry.username || 'Anonymous'} • {entry.turns} turns
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <button className='homebutton' onClick={() => navigate('/home')}> Go Back to Home </button>
                </div>

                <div className='main'>
                    <button className='startbutton' onClick={gamestart}> Start Game </button>
                </div>
            </div>
        )
    }

    if(startGame){
        return(
            <div className='contain'>
                <div className='top'>
                    <h2> Super cutesy memory game!</h2>
                    <p> to test your super cutesy memory!</p>
                </div>

                <div className='sidebar'>
                    <div className='howto'>
                        <h4> HOW TO PLAY THE GAME?</h4>
                        <li>Click on the card to flip it and reveal the picture</li>
                        <li>Find all the matching pairs in the grid</li>
                        <li>Aim to get all pairs in the least amount of turns</li>
                        <li>Pray and hope you aren't showing early signs of dementia</li>
                    </div>

                    <div className='boardleader'>
                        <h4 className='boardleader-title'>Who has the most terrible memory:</h4>
                        {boardleader.length === 0 ? (
                            <p style={{fontSize:'12px', marginTop:'6rem'}}>No scores yet...Did you forget to play?</p>
                        ) : (
                            boardleader.map((entry, i) => (
                                <div style={{marginTop: '5px'}} key={i}>
                                    <span>
                                        {i + 1}. {entry.username || 'Anonymous'} • {entry.turns} turns
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <button className='homebutton' onClick={() => navigate('/home')}> Go Back to Home </button>
                </div>

                <div className='game'>
                    <div className='card-grid'>
                        {cards.map(card => (
                            <Card 
                                key={card.id}
                                card={card}
                                handleChoice={handleChoice}
                                flipped={card === choiceOne || card === choiceTwo || card.matched}
                                disabled={disabled}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <button className='specialbutton' onClick={playpause}> Click for a cutesy song! </button>
                </div>

                <div>
                    <button className='restart' onClick={shuffleCards}> Reset Game </button>
                </div>

                <div className='turns'>
                    <p>Turns: {turns} </p>
                </div>
            </div>
        )
    }
}

function Card ({card, handleChoice, flipped, disabled}) {
    const handleClick = () => {
        if(!disabled){
            handleChoice(card)
        }
    }

    return (
        <div className="card">
            <div className = {flipped ? "flipped" : ""}>
                <img className="front" src={card.src} alt="card front" />
                <img className="back" src="/images/cover.png" alt="card back" onClick={handleClick}/>
            </div>
        </div>
    )
}

export default Memorygame;
