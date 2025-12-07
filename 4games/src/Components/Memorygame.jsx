import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Memorygame.css';

const INITIAL_CARDCOUNT = 4;
const STEP = 2;

const Memorygame = () => {
    const navigate = useNavigate();
    const [cardCount, setCardcount] = useState(INITIAL_CARDCOUNT);

    return (
        <div className='contain'>
            <div className='top'>
                <h2> Super cutesy memory game! </h2>
                <p> to test your super cutesy memory!</p>
            </div>

            <div className='leftside'>
                <div className='howto'>
                    <h2>How to play the game:</h2>
                    <p>1. Click on the cards to flip them.</p>
                    <p>2. Try and find the matching pairs.</p>
                    <p>3. Aim to get the least amount of turns.</p>
                    <p>4. Pray and hope you aren't showing early signs of dementia.</p>

                    <button onClick={() => navigate('/home')} style={{marginTop: '25rem'}}> Back to Home </button>
                </div>
            </div>

            <div className='center'>
                <h1>Amount of cards:</h1>
                <Counter cardsCount={cardCount} onClick={setCardcount} />
                <button > Start Game </button>
            </div>

        </div>
    );
};

const Counter = ({ cardCount, onClick }) => {
    const onDecrement = e => {
        e.preventDefault();
        const number = cardCount - STEP;
        if (number >= 2) onClick(number);
    };

    const onIncrement = e => {
        e.preventDefault();
        const number = cardCount + STEP;
        if (number <= 160) onClick(number);
    };

    return (
        <div className="quantity">
            <button className="minus" onClick={onDecrement}>
                -
            </button>
            <span className="quantity">{cardCount}</span>
            <button className="plus" onClick={onIncrement}>
                +
            </button>
        </div>
    );
};

export default Memorygame;