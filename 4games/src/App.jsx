// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import Home from './Pages/Home.jsx';

// Game Components (make sure these names match your files)
import Rockpaperscissor from './Components/Rockpaperscissor.jsx'; // <-- SINGULAR
import Tictactoe from './Components/Tictactoe.jsx';
import Memorygame from './Components/Memorygame.jsx';
import Quizgame from './Components/Quizgame.jsx';

// Styles
import './Pages/Auth.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />

          {/* Game Routes */}
          <Route path="/rockpaperscissor" element={<Rockpaperscissor />} /> {/* <-- SINGULAR */}
          <Route path="/tictactoe" element={<Tictactoe />} />
          <Route path="/memorygame" element={<Memorygame />} />
          <Route path="/quizgame" element={<Quizgame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
