import { useState, useEffect } from 'react';
import './Memorygame.css';
import Card from './Card';

const cardImages = [
    {"src": "/images/01.png", matched: false},
    {"src": "/images/02.png", matched: false},
    {"src": "/images/03.png", matched: false},
    {"src": "/images/04.png", matched: false},
    {"src": "/images/05.png", matched: false},
    {"src": "/images/06.png", matched: false},
    {"src": "/images/07.png", matched: false},
    {"src": "/images/08.png", matched: false}
]

function MemoryGame(){
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [start, setStart] = useState(false);

    const startGame = () => {
        setStart(true)
    }

    const shuffleCards = () => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }))
        
        setChoiceOne(null)
        setChoiceTwo(null)
        setCards(shuffledCards)
        setTurns(0)
    }

    const handleChoice = (card) =>{
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
    }

    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true)
            if(choiceOne.src === choiceTwo.src) {
                setCards(prevCards => {
                    return prevCards.map(card => {
                       if(card.src === choiceOne.src){
                        return {...card, matched: true}
                       } else {
                        return card
                       }
                    })
                })
                resetTurn()                   
            } else {
                setTimeout(() => resetTurn(), 1000)
            }
        }
    }, [choiceOne, choiceTwo])

    const resetTurn = () => {
        setChoiceOne(null)
        setChoiceTwo(null)
        setTurns(prevTurns => prevTurns + 1)
        setDisabled(false)
    }

    useEffect(() => {
        shuffleCards()
    }, [])

    return (
        <div className = "container-card">
            <h2> Super </h2>
            <div className="card-grid">
                {cards.map(card => (
                   <Card 
                        key={card.id} 
                        card={card} 
                        handleChoice={handleChoice}
                        flipped={card === choiceOne || card === choiceTwo || card.matched}
                        disabled={disabled} 
                        start={start}
                   />
                ))}
                <p>Turns: {turns}</p>
            </div>
        </div>
    )
}

export default MemoryGame;
