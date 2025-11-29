import React, { useState, useEffect } from 'react';
import './QuizGame.css';
import { useNavigate } from 'react-router-dom';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const quizData = {
  anatomy: [
    { question: "What is the largest organ in the human body?", options: ["Heart", "Skin", "Liver", "Lungs"], answer: 1 },
    { question: "How many bones are in the adult human body?", options: ["206", "201", "210", "196"], answer: 0 },
    { question: "What part of the brain controls balance?", options: ["Cerebrum", "Cerebellum", "Brainstem", "Hypothalamus"], answer: 1 },
    { question: "What type of joint is the shoulder?", options: ["Hinge", "Ball and Socket", "Pivot", "Saddle"], answer: 1 },
    { question: "Which blood cells help fight infection?", options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], answer: 1 },
    { question: "What is the main function of the kidneys?", options: ["Digest food", "Filter blood", "Pump blood", "Control hormones"], answer: 1 },
    { question: "Which muscle is known as the calf muscle?", options: ["Biceps", "Triceps", "Gastrocnemius", "Quadriceps"], answer: 2 },
    { question: "What is the name of the bone that protects the brain?", options: ["Femur", "Skull", "Spine", "Ribcage"], answer: 1 },
    { question: "How many chambers are in the human heart?", options: ["2", "3", "4", "5"], answer: 2 },
    { question: "What is the smallest unit of life?", options: ["Tissue", "Organ", "Cell", "Molecule"], answer: 2 },  
    { question: "Which part of the eye controls the amount of light that enters?", options: ["Cornea", "Iris", "Pupil", "Retina"], answer: 1 },
    { question: "What type of blood vessel carries blood away from the heart?", options: ["Veins", "Arteries", "Capillaries", "Venules"], answer: 1 },
    { question: "What is the primary function of red blood cells?", options: ["Fight infection", "Carry oxygen", "Clot blood", "Regulate temperature"], answer: 1 },
    { question: "Which organ is responsible for producing insulin?", options: ["Liver", "Pancreas", "Kidneys", "Spleen"], answer: 1 },
    { question: "What is the name of the largest bone in the human body?", options: ["Humerus", "Tibia", "Femur", "Fibula"], answer: 2 },  
    { question: "Which part of the brain is responsible for memory?", options: ["Cerebrum", "Cerebellum", "Hippocampus", "Brainstem"], answer: 2 },
    { question: "What type of muscle is the heart made of?", options: ["Skeletal", "Smooth", "Cardiac", "Voluntary"], answer: 2 },
    { question: "Which organ filters waste from the blood?", options: ["Liver", "Kidneys", "Lungs", "Intestines"], answer: 1 },
    { question: "What is the name of the tube that connects the throat to the stomach?", options: ["Trachea", "Esophagus", "Pharynx", "Larynx"], answer: 1 },
    { question: "Which vitamin is produced when the skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], answer: 3 },
  ],
  general: [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: 2 },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1 },
    { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"], answer: 1 },
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "Jane Austen"], answer: 2 },
    { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Gd", "Go"], answer: 0 },
    { question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: 2 },
    { question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: 2 },
    { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], answer: 2 },
    { question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: 2 },
    { question: "Which ocean is the largest?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: 3 },
    { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Pepper"], answer: 1 },
    { question: "Who is known as the 'Father of Computers'?", options: ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"], answer: 1 },
    { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], answer: 1 },
    { question: "Which country is known as the Land of the Rising Sun?", options: ["China", "Japan", "Thailand", "South Korea"], answer: 1 },
    { question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Kalahari", "Arctic"], answer: 0 },
  ],
  history: [
    { question: "Who was the first President of the United States?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], answer: 1 },
    { question: "In which year did World War II end?", options: ["1940", "1945", "1950", "1939"], answer: 1 },
    { question: "What ancient civilization built the pyramids?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], answer: 2 },
    { question: "Who was known as the Maid of Orléans?", options: ["Cleopatra", "Joan of Arc", "Marie Antoinette", "Catherine the Great"], answer: 1 },
    { question: "Which empire was ruled by Genghis Khan?", options: ["Roman Empire", "Mongol Empire", "Ottoman Empire", "Persian Empire"], answer: 1 },
    { question: "What was the name of the ship on which the Pilgrims traveled to America in 1620?", options: ["Santa Maria", "Mayflower", "Endeavour", "Beagle"], answer: 1 },
    { question: "Who was the British Prime Minister during most of World War II?", options: ["Winston Churchill", "Neville Chamberlain", "Clement Attlee", "Margaret Thatcher"], answer: 0 },
    { question: "In which year did the Berlin Wall fall?", options: ["1987", "1989", "1991", "1993"], answer: 1 },
    { question: "Who was the first man to step on the moon?", options: ["Yuri Gagarin", "Buzz Aldrin", "Neil Armstrong", "Michael Collins"], answer: 2 },
    { question: "What was the name of the first permanent English settlement in America?", options: ["Plymouth", "Roanoke", "Jamestown", "Salem"], answer: 2 },     
    { question: "Who was the Egyptian queen famous for her beauty and political acumen?", options: ["Nefertiti", "Cleopatra", "Hatshepsut", "Isis"], answer: 1 },
    { question: "Which war was fought between the North and South regions in the United States?", options: ["Revolutionary War", "Civil War", "World War I", "World War II"], answer: 1 },
    { question: "Who was the leader of the Soviet Union during World War II?", options: ["Vladimir Lenin", "Joseph Stalin", "Nikita Khrushchev", "Mikhail Gorbachev"], answer: 1 },
    { question: "What year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], answer: 1 },
    { question: "Who discovered penicillin?", options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Joseph Lister"], answer: 1 },
  ],
};

const QuizGame = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("front");
  const [category, setCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem("quizLeaderboard");
    return saved ? JSON.parse(saved) : [];
  });

  

  useEffect(() => {
    if (stage === "quiz") {
      setTimeLeft(10);
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

  useEffect(() => {
    if (category) {
      quizData[category] = shuffleArray(quizData[category]);
    }
  }, [category]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    if (index === quizData[category][currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentQuestion < quizData[category].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const newEntry = { category, score, date: new Date().toLocaleString() };
      const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 5); // top 5
      setLeaderboard(updated);
      localStorage.setItem("quizLeaderboard", JSON.stringify(updated));
      setStage("results");
    }
  };

  const resetGame = () => {
    setStage("front");
    setCategory(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
  };

  const containerStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    fontFamily: 'Press Start 2P, cursive',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyle = {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '0.8rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid rgba(0, 255, 255, 0.3)',
    zIndex: 10,
    flexShrink: 0
  };

  const titleStyle = {
    fontSize: '1.5rem',
    textShadow: '0 0 10px #0ff, 0 0 20px #0ff',
    color: '#fff'
  };

  const mainContentStyle = {
    display: 'flex',
    flex: 1,
    padding: '0',
    overflow: 'hidden'
  };

  const sidePanelStyle = {
    width: '20%',
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '1rem',
    borderRight: '1px solid rgba(0, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flexShrink: 0
  };

  const centerContentStyle = {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  };

  const rightPanelStyle = {
    width: '20%',
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '1rem',
    borderLeft: '1px solid rgba(0, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flexShrink: 0
  };

  const categoryCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    borderRadius: '15px',
    padding: '1rem',
    margin: '0.3rem 0',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  };

  const categoryIconStyle = {
    fontSize: '1.5rem'
  };

  const categoryInfoStyle = {
    flex: 1
  };

  const categoryTitleStyle = {
    fontSize: '0.8rem',
    marginBottom: '0.3rem',
    color: '#c5aeff'
  };

  const categoryDescStyle = {
    fontSize: '0.5rem',
    color: '#b0bec5',
    lineHeight: '1.2'
  };

  const leaderboardStyle = {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    padding: '0.8rem',
    marginTop: '0.5rem',
    height: '100%',
    overflowY: 'auto'
  };

  const leaderboardTitleStyle = {
    fontSize: '0.8rem',
    marginBottom: '0.8rem',
    color: '#c5aeff',
    textShadow: '0 0 5px #c5aeff',
    textAlign: 'center'
  };

  const leaderboardItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.4rem',
    margin: '0.4rem 0',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    fontSize: '0.5rem',
    borderLeft: '3px solid #0ff'
  };

  const questionCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    borderRadius: '15px',
    padding: '1.5rem',
    margin: '0.5rem 0',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const questionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  const questionTitleStyle = {
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
    lineHeight: '1.4',
    textAlign: 'center',
    color: '#fff'
  };

  const optionButtonStyle = {
    display: 'block',
    width: '100%',
    margin: '0.3rem 0',
    padding: '0.8rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.7rem',
    fontFamily: 'Press Start 2P, cursive',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left'
  };

  const correctOptionStyle = {
    ...optionButtonStyle,
    background: 'linear-gradient(145deg, #28a745, #2d8f41)',
    border: '1px solid rgba(40, 167, 69, 0.5)',
    boxShadow: '0 0 15px #0f0, 0 0 30px #0f0',
    animation: 'pulseGreen 0.5s'
  };

  const wrongOptionStyle = {
    ...optionButtonStyle,
    background: 'linear-gradient(145deg, #dc3545, #c82333)',
    border: '1px solid rgba(220, 53, 69, 0.5)',
    boxShadow: '0 0 15px #f00, 0 0 30px #f00',
    animation: 'shake 0.4s'
  };

  const timerStyle = {
    fontSize: '1rem',
    color: timeLeft <= 3 ? '#ff4d4d' : '#0ff',
    textShadow: `0 0 10px ${timeLeft <= 3 ? '#ff4d4d' : '#0ff'}`,
    animation: timeLeft <= 3 ? 'pulse 1s infinite' : 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const scoreStyle = {
    fontSize: '0.9rem',
    color: '#c5aeff'
  };

  const progressStyle = {
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '5px',
    margin: '0.8rem 0',
    overflow: 'hidden'
  };

  const progressBarStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #0ff, #f0f)',
    borderRadius: '5px',
    transition: 'width 0.3s ease'
  };

  const footerStyle = {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '0.8rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '2px solid rgba(0, 255, 255, 0.3)',
    flexShrink: 0
  };

  const buttonStyle = {
    padding: '8px 16px',
    fontSize: '0.7rem',
    cursor: 'pointer',
    background: 'linear-gradient(145deg, #7e57c2, #9575cd)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(126, 87, 194, 0.3)',
    fontFamily: 'Press Start 2P, cursive'
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(145deg, #ff4d4d, #d32f2f)',
    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)'
  };

  const homeButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(145deg, #007bff, #0056b3)',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
  };

  const decorativeElementStyle = {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%)',
    filter: 'blur(40px)',
    zIndex: -1
  };

  if (stage === "front") {
    return (
      <div style={containerStyle}>
       
        <div style={headerStyle}>
          <h1 style={titleStyle}>QUIZ ARCADE</h1>
          <div style={timerStyle}>
            <span>⏱️</span>
            <span>00:00</span>
          </div>
        </div>
        
        
        <div style={mainContentStyle}>
         
          <div style={sidePanelStyle}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: '#c5aeff' }}>GAME INFO</h3>
            <div style={{ fontSize: '0.6rem', color: '#b0bec5', lineHeight: '1.4' }}>
              <p>Test your knowledge in various categories!</p>
              <p style={{ marginTop: '0.8rem' }}>🏆 High scores are saved locally</p>
              <p style={{ marginTop: '0.8rem' }}>⏱️ Each question has 10 seconds</p>
              <p style={{ marginTop: '0.8rem' }}>🎯 Score points for correct answers</p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '0.8rem', color: '#c5aeff' }}>TIPS</h3>
              <div style={{ fontSize: '0.5rem', color: '#b0bec5', lineHeight: '1.4' }}>
                <p>• Read questions carefully</p>
                <p>• Trust your instincts</p>
                <p>• Stay calm under pressure</p>
              </div>
            </div>
          </div>
          
         
          <div style={centerContentStyle}>
            <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ ...decorativeElementStyle, top: '10%', left: '10%', animation: 'float 6s ease-in-out infinite' }}></div>
              <div style={{ ...decorativeElementStyle, bottom: '10%', right: '10%', animation: 'float 8s ease-in-out infinite reverse' }}></div>
              
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', color: '#fff', animation: 'glow 2s ease-in-out infinite alternate' }}>
                SELECT CATEGORY
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '600px', margin: '0 auto' }}>
                <div 
                  style={categoryCardStyle}
                  onClick={() => { setCategory("anatomy"); setStage("quiz"); }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(126, 87, 194, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(126, 87, 194, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={categoryIconStyle}>🧬</div>
                  <div style={categoryInfoStyle}>
                    <div style={categoryTitleStyle}>HUMAN ANATOMY</div>
                    <div style={categoryDescStyle}>Test your knowledge of the human body and its systems</div>
                  </div>
                </div>
                
                <div 
                  style={categoryCardStyle}
                  onClick={() => { setCategory("general"); setStage("quiz"); }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(126, 87, 194, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(126, 87, 194, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={categoryIconStyle}>🌍</div>
                  <div style={categoryInfoStyle}>
                    <div style={categoryTitleStyle}>GENERAL QUIZ</div>
                    <div style={categoryDescStyle}>Challenge yourself with questions from various fields</div>
                  </div>
                </div>
                
                <div 
                  style={categoryCardStyle}
                  onClick={() => { setCategory("history"); setStage("quiz"); }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(126, 87, 194, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(126, 87, 194, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={categoryIconStyle}>📜</div>
                  <div style={categoryInfoStyle}>
                    <div style={categoryTitleStyle}>HISTORY</div>
                    <div style={categoryDescStyle}>Journey through time and test your historical knowledge</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        
          <div style={rightPanelStyle}>
            <div style={leaderboardStyle}>
              <h3 style={leaderboardTitleStyle}>🏆 LEADERBOARD</h3>
              {leaderboard.length === 0 ? (
                <p style={{ fontSize: '0.6rem', color: '#b0bec5', textAlign: 'center' }}>No scores yet. Be the first!</p>
              ) : (
                leaderboard.map((entry, i) => (
                  <div key={i} style={leaderboardItemStyle}>
                    <span>{i + 1}. {entry.category.toUpperCase()}</span>
                    <span>{entry.score} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        

        <div style={footerStyle}>
          <button 
            style={homeButtonStyle}
            onClick={() => navigate('/home')}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(145deg, #0056b3, #004085)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 86, 179, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(145deg, #007bff, #0056b3)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
            }}
          >
            🏠 HOME
          </button>
          
          <div style={{ fontSize: '0.6rem', color: '#b0bec5' }}>
            QUIZ ARCADE v1.chate
          </div>
        </div>
      </div>
    );
  }

  if (stage === "quiz") {
    const questionObj = quizData[category][currentQuestion];
    const progress = ((currentQuestion + 1) / quizData[category].length) * 100;
    
    return (
      <div style={containerStyle}>
        
        <div style={headerStyle}>
          <h1 style={titleStyle}>{category.toUpperCase()} QUIZ</h1>
          <div style={timerStyle}>
            <span>⏱️</span>
            <span>{timeLeft}s</span>
          </div>
        </div>
      
        <div style={mainContentStyle}>
          <div style={sidePanelStyle}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: '#c5aeff' }}>QUESTION INFO</h3>
            <div style={{ fontSize: '0.6rem', color: '#b0bec5', lineHeight: '1.4' }}>
              <p>Question {currentQuestion + 1} of {quizData[category].length}</p>
              <p style={{ marginTop: '0.8rem' }}>Category: {category.toUpperCase()}</p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '0.8rem', color: '#c5aeff' }}>PROGRESS</h3>
              <div style={progressStyle}>
                <div style={{ ...progressBarStyle, width: `${progress}%` }}></div>
              </div>
              <p style={{ fontSize: '0.6rem', color: '#b0bec5', textAlign: 'center', marginTop: '0.5rem' }}>
                {Math.round(progress)}% Complete
              </p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '0.8rem', color: '#c5aeff' }}>SCORE</h3>
              <div style={{ fontSize: '1.2rem', color: '#0ff', textAlign: 'center' }}>
                {score}
              </div>
            </div>
          </div>
          
          <div style={centerContentStyle}>
            <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ ...decorativeElementStyle, top: '10%', left: '10%', animation: 'float 6s ease-in-out infinite' }}></div>
              <div style={{ ...decorativeElementStyle, bottom: '10%', right: '10%', animation: 'float 8s ease-in-out infinite reverse' }}></div>
              
              <div style={questionCardStyle}>
                <h3 style={questionTitleStyle}>
                  {questionObj.question}
                </h3>
                
                <div>
                  {questionObj.options.map((option, index) => {
                    let buttonStyle = optionButtonStyle;
                    
                    if (selectedOption !== null) {
                      if (index === questionObj.answer) {
                        buttonStyle = correctOptionStyle;
                      } else if (index === selectedOption) {
                        buttonStyle = wrongOptionStyle;
                      }
                    }
                    
                    return (
                      <button
                        key={index}
                        style={buttonStyle}
                        onClick={() => handleOptionClick(index)}
                        disabled={selectedOption !== null}
                        onMouseEnter={(e) => {
                          if (selectedOption === null) {
                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.target.style.transform = 'translateX(5px)';
                            e.target.style.boxShadow = '0 0 10px #0ff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedOption === null) {
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.transform = 'translateX(0)';
                            e.target.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <div style={rightPanelStyle}>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px', padding: '0.8rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '0.8rem', color: '#c5aeff', textAlign: 'center' }}>TIMER</h3>
              <div style={{ 
                fontSize: '1.5rem', 
                color: timeLeft <= 3 ? '#ff4d4d' : '#0ff', 
                textShadow: `0 0 10px ${timeLeft <= 3 ? '#ff4d4d' : '#0ff'}`,
                textAlign: 'center',
                animation: timeLeft <= 3 ? 'pulse 1s infinite' : 'none'
              }}>
                {timeLeft}
              </div>
              <div style={progressStyle}>
                <div style={{ 
                  ...progressBarStyle, 
                  width: `${(timeLeft / 10) * 100}%`,
                  background: timeLeft <= 3 ? 
                    'linear-gradient(90deg, #ff4d4d, #ff6b6b)' : 
                    'linear-gradient(90deg, #0ff, #f0f)'
                }}></div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px', padding: '0.8rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '0.8rem', color: '#c5aeff', textAlign: 'center' }}>STATS</h3>
              <div style={{ fontSize: '0.6rem', color: '#b0bec5', lineHeight: '1.4' }}>
                <p>Correct: {score}</p>
                <p>Remaining: {quizData[category].length - currentQuestion - 1}</p>
                <p>Accuracy: {currentQuestion > 0 ? Math.round((score / currentQuestion) * 100) : 0}%</p>
              </div>
            </div>
            
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px', padding: '0.8rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '0.8rem', color: '#c5aeff', textAlign: 'center' }}>TIPS</h3>
              <div style={{ fontSize: '0.5rem', color: '#b0bec5', lineHeight: '1.4' }}>
                <p>• Read carefully</p>
                <p>• Stay focused</p>
                <p>• Trust your gut</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style={footerStyle}>
          <button 
            style={backButtonStyle}
            onClick={resetGame}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(145deg, #d32f2f, #b71c1c)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 77, 77, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(145deg, #ff4d4d, #d32f2f)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(255, 77, 77, 0.3)';
            }}
          >
            🏠 BACK TO CATEGORIES
          </button>
          
          <div style={{ fontSize: '0.6rem', color: '#b0bec5' }}>
            QUIZ ARCADE v1.chate
          </div>
        </div>
      </div>
    );
  }

  if (stage === "results") {
    const percentage = Math.round((score / quizData[category].length) * 100);
    
    return (
      <div style={containerStyle}>
        
        <div style={headerStyle}>
          <h1 style={titleStyle}>QUIZ RESULTS</h1>
          <div style={timerStyle}>
            <span>🏆</span>
            <span>{percentage}%</span>
          </div>
        </div>
        
        <div style={mainContentStyle}>
          <div style={sidePanelStyle}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: '#c5aeff' }}>PERFORMANCE</h3>
            <div style={{ fontSize: '0.6rem', color: '#b0bec5', lineHeight: '1.4' }}>
              <p>Category: {category.toUpperCase()}</p>
              <p style={{ marginTop: '0.8rem' }}>Correct: {score}/{quizData[category].length}</p>
              <p style={{ marginTop: '0.8rem' }}>Accuracy: {percentage}%</p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '0.8rem', color: '#c5aeff' }}>ACHIEVEMENT</h3>
              <div style={{ 
                fontSize: '2.5rem', 
                textAlign: 'center',
                color: percentage >= 80 ? '#0f0' : percentage >= 60 ? '#ff0' : '#f00',
                textShadow: `0 0 10px ${percentage >= 80 ? '#0f0' : percentage >= 60 ? '#ff0' : '#f00'}`
              }}>
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : '🥉'}
              </div>
            </div>
          </div>
          
          <div style={centerContentStyle}>
            <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ ...decorativeElementStyle, top: '10%', left: '10%', animation: 'float 6s ease-in-out infinite' }}></div>
              <div style={{ ...decorativeElementStyle, bottom: '10%', right: '10%', animation: 'float 8s ease-in-out infinite reverse' }}></div>
              
              <div style={questionCardStyle}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', color: '#fff', animation: 'glow 2s ease-in-out infinite alternate' }}>
                  QUIZ COMPLETED!
                </h2>
                
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', color: '#c5aeff', marginBottom: '0.8rem' }}>
                    {score}/{quizData[category].length}
                  </div>
                  <div style={{ fontSize: '1rem', color: '#b0bec5' }}>
                    {percentage >= 80 
                      ? "🏆 Outstanding! You're a quiz master!" 
                      : percentage >= 60 
                        ? "🎉 Good job! You know your stuff!" 
                        : "📚 Keep learning and try again!"
                    }
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem' }}>
                  <button 
                    style={buttonStyle}
                    onClick={resetGame}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(145deg, #673ab7, #9c27b0)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(156, 39, 176, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(145deg, #7e57c2, #9575cd)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(126, 87, 194, 0.3)';
                    }}
                  >
                    🔄 PLAY AGAIN
                  </button>
                  
                  <button 
                    style={backButtonStyle}
                    onClick={resetGame}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(145deg, #d32f2f, #b71c1c)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(255, 77, 77, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(145deg, #ff4d4d, #d32f2f)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(255, 77, 77, 0.3)';
                    }}
                  >
                    🏠 CATEGORIES
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div style={rightPanelStyle}>
            <div style={leaderboardStyle}>
              <h3 style={leaderboardTitleStyle}>🏆 LEADERBOARD</h3>
              {leaderboard.length === 0 ? (
                <p style={{ fontSize: '0.6rem', color: '#b0bec5', textAlign: 'center' }}>No scores yet. Be the first!</p>
              ) : (
                leaderboard.map((entry, i) => (
                  <div key={i} style={{
                    ...leaderboardItemStyle,
                    background: entry.category === category && entry.score === score ? 
                      'rgba(126, 87, 194, 0.3)' : 
                      'rgba(255, 255, 255, 0.1)'
                  }}>
                    <span>{i + 1}. {entry.category.toUpperCase()}</span>
                    <span>{entry.score} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div style={footerStyle}>
          <button 
            style={homeButtonStyle}
            onClick={() => navigate('/home')}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(145deg, #0056b3, #004085)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 86, 179, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(145deg, #007bff, #0056b3)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
            }}
          >
            🏠 HOME
          </button>
          
          <div style={{ fontSize: '0.6rem', color: '#b0bec5' }}>
            QUIZ ARCADE v1.chate
          </div>
        </div>
      </div>
    );
  }
};

export default QuizGame;