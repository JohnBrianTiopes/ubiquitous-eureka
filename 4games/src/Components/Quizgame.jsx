// src/Components/Quizgame.jsx
import React, { useState, useEffect } from 'react';
import './QuizGame.css';

const quizData = {
  anatomy: [
    { question: "What is the largest organ in the human body?", options: ["Heart", "Skin", "Liver", "Lungs"], answer: 1 },
    { question: "How many bones are in the adult human body?", options: ["206", "201", "210", "196"], answer: 0 },
  ],
  general: [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: 2 },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1 },
  ],
  history: [
    { question: "Who was the first President of the United States?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], answer: 1 },
    { question: "In which year did World War II end?", options: ["1940", "1945", "1950", "1939"], answer: 1 },
  ],
};

const QuizGame = () => {
  const [stage, setStage] = useState("front"); // "front" | "quiz" | "results"
  const [category, setCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [leaderboard, setLeaderboard] = useState(() => {
    // Load leaderboard from localStorage if available
    const saved = localStorage.getItem("quizLeaderboard");
    return saved ? JSON.parse(saved) : [];
  });

  // Timer logic
  useEffect(() => {
    if (stage === "quiz") {
      setTimeLeft(15);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleNext();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, currentQuestion]);

  // Handle answer click
  const handleOptionClick = (index) => {
    setSelectedOption(index);
    if (index === quizData[category][currentQuestion].answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  // Next question or results
  const handleNext = () => {
    setSelectedOption(null);
    if (currentQuestion < quizData[category].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save score to leaderboard
      const newEntry = { category, score, date: new Date().toLocaleString() };
      const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 5); // top 5
      setLeaderboard(updated);
      localStorage.setItem("quizLeaderboard", JSON.stringify(updated));
      setStage("results");
    }
  };

  // Reset game
  const resetGame = () => {
    setStage("front");
    setCategory(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
  };

  // Stage 1: Front page with categories
  if (stage === "front") {
    return (
      <div>
        <h2>Welcome to the Quiz Game!</h2>
        <p>Select a category to begin:</p>
        <button onClick={() => { setCategory("anatomy"); setStage("quiz"); }}>Human Anatomy</button>
        <button onClick={() => { setCategory("general"); setStage("quiz"); }}>General Quiz</button>
        <button onClick={() => { setCategory("history"); setStage("quiz"); }}>History</button>

        <h3>Leaderboard (Top 5)</h3>
        <ul>
          {leaderboard.map((entry, i) => (
            <li key={i}>
              {entry.category.toUpperCase()} — {entry.score} points ({entry.date})
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Stage 2: Quiz
  if (stage === "quiz") {
    const questionObj = quizData[category][currentQuestion];
    return (
      <div>
        <h2>{category.toUpperCase()} Quiz</h2>
        <p>Question {currentQuestion + 1} of {quizData[category].length}</p>
        <p>Score: {score}</p>
        <p>Time left: {timeLeft}s</p>
        <h3>{questionObj.question}</h3>
        <div>
          {questionObj.options.map((option, index) => {
            let className = "option";
            if (selectedOption !== null) {
              if (index === questionObj.answer) {
                className += " correct";
              } else if (index === selectedOption) {
                className += " wrong";
              }
            }
            return (
              <button
                key={index}
                className={className}
                onClick={() => handleOptionClick(index)}
                disabled={selectedOption !== null}
              >
                {option}
              </button>
            );
          })}
        </div>
        <button onClick={resetGame} style={{ marginTop: "1rem" }}>Back to Categories</button>
      </div>
    );
  }

  // Stage 3: Results
  if (stage === "results") {
    return (
      <div>
        <h2>Quiz Finished!</h2>
        <p>Your score: {score} / {quizData[category].length}</p>
        <button onClick={resetGame}>Back to Categories</button>

        <h3>Leaderboard (Top 5)</h3>
        <ul>
          {leaderboard.map((entry, i) => (
            <li key={i}>
              {entry.category.toUpperCase()} — {entry.score} points ({entry.date})
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default QuizGame;