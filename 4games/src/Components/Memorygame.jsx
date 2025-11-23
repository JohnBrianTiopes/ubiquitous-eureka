import { useState } from 'react';

const cardImages = [
    {"src": "../images/01.jpg"},
    {"src": "../images/02.jpg"},
    {"src": "../images/03.jpg"},
    {"src": "../images/04.jpg"},
    {"src": "../images/05.jpg"},
    {"src": "../images/06.jpg"},
    {"src": "../images/07.jpg"},
    {"src": "../images/08.jpg"}
]

function MemoryGame(){
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);

    // shuffle cards
    const shuffleCards = () => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }))
        
        setCards(shuffledCards)
        setTurns(0)
    }

    return (
        <div className = "container-card">
            <h2>Super Awesome Memory game</h2>
            <p>to test your Super Awesome Memory!</p>
            <button onClick={shuffleCards}>Start Super Awesome game</button>
        </div>
    )
}

export default MemoryGame;