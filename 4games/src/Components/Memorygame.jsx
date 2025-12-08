import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Memorygame.css';

const cardArray = [
    {"src": "/images/01.png", matched: false},
    {"src": "/images/02.png", matched: false},
    {"src": "/images/03.png", matched: false},
    {"src": "/images/04.png", matched: false},
    {"src": "/images/05.png", matched: false},
    {"src": "/images/06.png", matched: false},
    {"src": "/images/07.png", matched: false},
    {"src": "/images/08.png", matched: false}
]

const Memorygame = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.userId) {
            fetch(`http://localhost:5000/api/user/${storedUser.userId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch user');
                return res.json();
            })
            .then((data) => setUsername(data.username))
            .catch(() => {
                setUsername(storedUser.username || 'user');
            });
        }
    }, []);

    return (
        <div className='contain'>
            <div className='top'>
                <h2> Super cutesy Memory game! </h2>
                <p> to test your super cutesy memory!</p>
                <div className='player'>
                    <h3> Who's playing? </h3>
                    <p style={{marginTop: '5px', fontFamily: 'Jura', fontSize:'15px'}}> {username} </p>
                </div>
            </div>

            
            <div className='main'>

            </div>

            <div className='sidebar'>
                <div className='howto'>
                    <h2>How to play the game:</h2>
                    <p>1. Click on the cards to flip them.</p>
                    <p>2. Try and find the matching pairs.</p>
                    <p>3. Aim to get the least amount of turns.</p>
                    <p>4. Pray and hope you aren't showing early signs of dementia.</p>
                </div>

                <div className='leaderboard'>
                    <h4> Who has the most terrible memory:</h4>
                </div>

                <button onClick={() => navigate('/home')} style={{marginTop: '1.5rem'}}> Back to Home </button>
            </div>  
        </div>
    );
};

export default Memorygame;