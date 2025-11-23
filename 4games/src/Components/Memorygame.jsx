import { useState } from 'react';
import './Memorygame.css';
const cardImages = [
    {"src": "/images/01.png"},
    {"src": "/images/02.png"},
    {"src": "/images/03.png"},
    {"src": "/images/04.png"},
    {"src": "/images/05.png"},
    {"src": "/images/06.png"},
    {"src": "/images/07.png"},
    {"src": "/images/08.png"}
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

            <div className="card-grid">
                {cards.map(card => (
                    <div className="card" key={card.id}>
                        <div>
                            <img className="front" src={card.src} alt="card front"/>
                            <img className="back" src="/images/cover.png" alt="card back"/>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MemoryGame;