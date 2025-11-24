import React from 'react';
import { useNavigate } from 'react-router-dom';

const Quizgame = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>
            <h1>Quiz Game</h1>
            <p>Game coming soon!</p>
            <button onClick={() => navigate('/home')} style={{ padding: '10px 15px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                Back to Home
            </button>
        </div>
    );
};

export default Quizgame;