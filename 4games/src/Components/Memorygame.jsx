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

    const shuffleCards = () => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }))
        
        setCards(shuffledCards)
        setTurns(0)
    }

    const handleChoice = (card) =>{
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
    }

    const resetTurn = () => {
        setChoiceOne(null)
        setChoiceTwo(null)
        setTurns(prevTurns => prevTurns + 1)
    }

    useEffect(() => {
        if (choiceOne && choiceTwo) {
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

    return (
        <div className = "container-card">
            <h2>Super Cutesy Memory game</h2>
            <p>to test your Super Cutesy Memory!</p>
            <button onClick={shuffleCards}>Start Super Cutesy game</button>

            <div className="card-grid">
                {cards.map(card => (
                   <Card 
                        key={card.id} 
                        card={card} 
                        handleChoice={handleChoice}
                        flipped={card === choiceOne || card === choiceTwo || card.matched} 
                   />
                ))}
                <p>Turns: {turns}</p>
            </div>
        </div>
    )
}

export default MemoryGame;