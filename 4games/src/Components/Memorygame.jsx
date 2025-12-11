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

function Memorygame() {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [isWon, setIsWon] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [boardleader, setBoardleader] = useState(() => {
        const savedscore = localStorage.getItem('mgleaderboard');
        return savedscore ? JSON.parse(savedscore) : [];
    });

    const shuffleCards = () => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({...card, id: Math.random() }))
        setChoiceOne(null)
        setChoiceTwo(null)
        setCards(shuffledCards)
        setTurns(0)
        setMatchedPairs(0)
        setIsWon(false)
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
        }
    }, [matchedPairs]);

    useEffect(() => {
        if(startGame){
            setTimeout(() => shuffleCards(), 1000)
        }
    }, [startGame]);

    const playpause = () => {

    }

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

                    </div>
                    <button onClick={() => navigate('/home')}> Go Back to Home </button>
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

                    </div>
                    <button onClick={() => navigate('/home')}> Go Back to Home </button>
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
                        <p style={{fontFamily: 'Press start 2p'}}>Turns: {turns} </p>
                    </div>
                </div>

                <div>
                    <button className='specialbutton'> Click for a cutesy song! </button>
                </div>

                <div>
                    <button className='restart' onClick={shuffleCards}> Reset Game </button>
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
