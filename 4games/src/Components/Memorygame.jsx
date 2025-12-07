import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_CARDCOUNT = 4;
const CARDS = [

]
const STEP = 2;

const Memorygame = () => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState(() =>{
        const save = localStorage.getItem('mgleaderboard');
        return save ? JSON.parse(save) : [];
    });
    const [cardcount, setCardcount] = useState(INITIAL_CARDCOUNT)

    return (
        <div className="container">
            <div className="leftside">

            </div>

            <div className="center">

            </div>

            <div className="rightside">

            </div>

        </div>
    );
};

const Counter = ({ cardsCount, onClick }) => {
    const onDecrement = e => {
        e.preventDefault();
        const number = cardsCount - STEP;
        if (number >= 2) onClick(number);
    };

    const onIncrement = e => {
        e.preventDefault();
        const number = cardsCount + STEP;
        if (number <= 160) onClick(number);
    };

    return (
        <div className="quantity">
            <button className="minus" onClick={onDecrement}>
                -
            </button>
            <span className="quantity">{cardsCount}</span>
            <button className="plus" onClick={onIncrement}>
                +
            </button>
        </div>
    );
};

export default Memorygame;