import React, { useState, useEffect, useMemo, useCallback } from 'react';
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


const multipleChoiceQuestions = {
  anatomy: [
    { question: "What is the largest organ in the human body?", options: ["Heart", "Skin", "Liver", "Lungs"], answer: "Skin", },
    { question: "How many bones are in the adult human body?", options: ["206", "201", "210", "196"], answer: "206",  },
    { question: "What part of the brain controls balance?", options: ["Cerebrum", "Cerebellum", "Brainstem", "Hypothalamus"], answer: "Cerebellum", },
    { question: "What type of joint is the shoulder?", options: ["Hinge", "Ball and Socket", "Pivot", "Saddle"], answer: "Ball and Socket", },
    { question: "Which blood cells help fight infection?", options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], answer: "White blood cells", },
    { question: "What is the main function of the kidneys?", options: ["Digest food", "Filter blood", "Pump blood", "Control hormones"], answer: "Filter blood", },
    { question: "Which muscle is known as the calf muscle?", options: ["Biceps", "Triceps", "Gastrocnemius", "Quadriceps"], answer: "Gastrocnemius", },
    { question: "What is the name of the bone that protects the brain?", options: ["Femur", "Skull", "Spine", "Ribcage"], answer: "Skull", },
    { question: "How many chambers are in the human heart?", options: ["2", "3", "4", "5"], answer: "4", },
    { question: "What is the smallest unit of life?", options: ["Tissue", "Organ", "Cell", "Molecule"], answer: "Cell", },  
    { question: "Which part of the eye controls the amount of light that enters?", options: ["Cornea", "Iris", "Pupil", "Retina"], answer: "Iris", },
    { question: "What type of blood vessel carries blood away from the heart?", options: ["Veins", "Arteries", "Capillaries", "Venules"], answer: "Arteries",  },
    { question: "What is the primary function of red blood cells?", options: ["Fight infection", "Carry oxygen", "Clot blood", "Regulate temperature"], answer: "Carry oxygen",},
    { question: "Which organ is responsible for producing insulin?", options: ["Liver", "Pancreas", "Kidneys", "Spleen"], answer: "Pancreas",  },
    { question: "What is the name of the largest bone in the human body?", options: ["Humerus", "Tibia", "Femur", "Fibula"], answer: "Femur",  },  
    { question: "Which part of the brain is responsible for memory?", options: ["Cerebrum", "Cerebellum", "Hippocampus", "Brainstem"], answer: "Hippocampus", },
    { question: "What type of muscle is the heart made of?", options: ["Skeletal", "Smooth", "Cardiac", "Voluntary"], answer: "Cardiac",},
    { question: "Which organ filters waste from the blood?", options: ["Liver", "Kidneys", "Lungs", "Intestines"], answer: "Kidneys", },
    { question: "What is the name of the tube that connects the throat to the stomach?", options: ["Trachea", "Esophagus", "Pharynx", "Larynx"], answer: "Esophagus", },
    { question: "Which vitamin is produced when the skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], answer: "Vitamin D", },
    { question: "What part of the brain regulates body temperature?", options: ["Hypothalamus", "Cerebrum", "Cerebellum", "Brainstem"], answer: "Hypothalamus", },
    { question: "Which cells in the body are responsible for transmitting nerve impulses?", options: ["Muscle cells", "Red blood cells", "Neurons", "Epithelial cells"], answer: "Neurons", },
    { question: "What is the name of the fluid that cushions and protects the brain and spinal cord?", options: ["Blood", "Lymph", "Cerebrospinal fluid", "Plasma"], answer: "Cerebrospinal fluid", },
    { question: "Which part of the ear is responsible for balance?", options: ["Cochlea", "Eardrum", "Semicircular canals", "Auditory nerve"], answer: "Semicircular canals",  },
    { question: "What is the name of the pigment that gives skin its color?", options: ["Carotene", "Melanin", "Hemoglobin", "Chlorophyll"], answer: "Melanin",  },
    { question: "Which organ is primarily responsible for detoxifying chemicals and metabolizing drugs?", options: ["Kidneys", "Liver", "Lungs", "Spleen"], answer: "Liver",  },
    { question: "What is the name of the structure that connects muscles to bones?", options: ["Ligaments", "Tendons", "Cartilage", "Fascia"], answer: "Tendons", },
    { question: "Which part of the cell contains genetic material?", options: ["Cytoplasm", "Nucleus", "Mitochondria", "Ribosomes"], answer: "Nucleus", },

  ],
  general: [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris",  },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars",  },
    { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"], answer: "Blue Whale",  },
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "Jane Austen"], answer: "William Shakespeare",  },
    { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Gd", "Go"], answer: "Au",  },
    { question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: "7",  },
    { question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: "Diamond",  },
    { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], answer: "Leonardo da Vinci",  },
    { question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: "2",  },
    { question: "Which ocean is the largest?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: "Pacific Ocean",  },
    { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Pepper"], answer: "Avocado",  },
    { question: "Who is known as the 'Father of Computers'?", options: ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"], answer: "Charles Babbage", },
    { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], answer: "100°C", },
    { question: "Which country is known as the Land of the Rising Sun?", options: ["China", "Japan", "Thailand", "South Korea"], answer: "Japan", },
    { question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Kalahari", "Arctic"], answer: "Sahara", },
    { question: "Who discovered penicillin?", options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Joseph Lister"], answer: "Alexander Fleming", },
    { question: "What is the tallest mountain in the world?", options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"], answer: "Mount Everest",  },
    { question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide", },
    { question: "Who developed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"], answer: "Albert Einstein",},
    { question: "What is the largest organ inside the human body?", options: ["Liver", "Heart", "Lungs", "Kidneys"], answer: "Liver",},
    { question: "Which element has the chemical symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Oxide"], answer: "Oxygen", },
    { question: "What is the main language spoken in Brazil?", options: ["Spanish", "Portuguese", "French", "English"], answer: "Portuguese", },
    { question: "Who wrote '1984'?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Jules Verne"], answer: "George Orwell",},
  ],






  history: [
    { question: "Who was the first President of the United States?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], answer: "George Washington",  },
    { question: "In which year did World War II end?", options: ["1940", "1945", "1950", "1939"], answer: "1945", },
    { question: "What ancient civilization built the pyramids?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], answer: "Egyptians",  },
    { question: "Who was known as the Maid of Orléans?", options: ["Cleopatra", "Joan of Arc", "Marie Antoinette", "Catherine the Great"], answer: "Joan of Arc", },
    { question: "Which empire was ruled by Genghis Khan?", options: ["Roman Empire", "Mongol Empire", "Ottoman Empire", "Persian Empire"], answer: "Mongol Empire",  },
    { question: "What was the name of the ship on which the Pilgrims traveled to America in 1620?", options: ["Santa Maria", "Mayflower", "Endeavour", "Beagle"], answer: "Mayflower",  },
    { question: "Who was the British Prime Minister during most of World War II?", options: ["Winston Churchill", "Neville Chamberlain", "Clement Attlee", "Margaret Thatcher"], answer: "Winston Churchill",  },
    { question: "In which year did the Berlin Wall fall?", options: ["1987", "1989", "1991", "1993"], answer: "1989",  },
    { question: "Who was the first man to step on the moon?", options: ["Yuri Gagarin", "Buzz Aldrin", "Neil Armstrong", "Michael Collins"], answer: "Neil Armstrong",  },
    { question: "What was the name of the first permanent English settlement in America?", options: ["Plymouth", "Roanoke", "Jamestown", "Salem"], answer: "Jamestown",  },     
    { question: "Who was the Egyptian queen famous for her beauty and political acumen?", options: ["Nefertiti", "Cleopatra", "Hatshepsut", "Isis"], answer: "Cleopatra",  },
    { question: "Which war was fought between the North and South regions in the United States?", options: ["Revolutionary War", "Civil War", "World War I", "World War II"], answer: "Civil War",  },
    { question: "Who was the leader of the Soviet Union during World War II?", options: ["Vladimir Lenin", "Joseph Stalin", "Nikita Khrushchev", "Mikhail Gorbachev"], answer: "Joseph Stalin",  },
    { question: "What year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], answer: "1912", hint: "I struck an iceberg on my maiden voyage despite receiving warnings." },
    { question: "Who discovered penicillin?", options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Joseph Lister"], answer: "Alexander Fleming",  },
    { question: "What was the name of the first artificial Earth satellite?", options: ["Apollo 11", "Sputnik 1", "Explorer 1", "Vostok 1"], answer: "Sputnik 1", },
    { question: "Who was the first female Prime Minister of the United Kingdom?", options: ["Theresa May", "Margaret Thatcher", "Angela Merkel", "Indira Gandhi"], answer: "Margaret Thatcher",  },
    { question: "In which year did India gain independence from British rule?", options: ["1945", "1947", "1950", "1952"], answer: "1947", hint: "I gained independence on August 15th." },
    { question: "Who was the first emperor of Rome?", options: ["Julius Caesar", "Augustus", "Nero", "Caligula"], answer: "Augustus",  },
    { question: "What was the name of the ship that carried Charles Darwin on his voyage to the Galápagos Islands?", options: ["Beagle", "Endeavour", "Santa Maria", "Mayflower"], answer: "Beagle" },
    { question: "Who was the leader of the    Mongol Empire?", options: ["Kublai Khan", "Genghis Khan", "Tamerlane", "Ogedei Khan"], answer: "Genghis Khan",  },
    { question: "In which year did the American Civil War begin?", options: ["1859", "1861", "1863", "1865"], answer: "1861",  },  
    
  ],
};


const identificationQuestions = {
  anatomy: [
    { question: "I am the largest organ in your body, protecting you from the outside world. What am I?", answer: "Skin", },
    { question: "I am a muscle that never stops pumping blood throughout your life. What am I?", answer: "Heart",  },
    { question: "I am the part of your brain that helps you maintain balance and coordination. What am I?", answer: "Cerebellum", },
    { question: "I am the longest and strongest bone in your body, located in your thigh. What am I?", answer: "Femur",  },
    { question: "I am a cell type that carries oxygen throughout your body. What am I?", answer: "Red blood cell",  },
    { question: "I am an organ that produces insulin to regulate blood sugar. What am I?", answer: "Pancreas",  },
    { question: "I am the part of your eye that changes size to control light entry. What am I?", answer: "Iris",  },
    { question: "I am a type of vessel that carries blood back to your heart. What am I?", answer: "Vein",  },
    { question: "I am the part of the brain responsible for forming new memories. What am I?", answer: "Hippocampus",  },
    { question: "I am a muscle at the back of your lower leg, commonly called the calf muscle. What am I?", answer: "Gastrocnemius",},
  ],
  general: [
    { question: "I am the capital city of France, known for the Eiffel Tower. What am I?", answer: "Paris", },
    { question: "I am the fourth planet from the Sun, known as the Red Planet. What am I?", answer: "Mars",  },
    { question: "I am the largest mammal on Earth, living in the ocean. What am I?", answer: "Blue Whale",},
    { question: "I am a chemical element with the symbol Au and known for my value. What am I?", answer: "Gold",  },
    { question: "I am the hardest natural substance on Earth, often used in jewelry. What am I?", answer: "Diamond",  },
    { question: "I am the country known as the Land of the Rising Sun. What am I?", answer: "Japan",  },
    { question: "I am the smallest prime number in mathematics. What am I?", answer: "2",  },
    { question: "I am the largest ocean on Earth, covering more than 30% of the planet's surface. What am I?", answer: "Pacific Ocean",  },
    { question: "I am the main ingredient in guacamole, a green fruit. What am I?", answer: "Avocado",  },
    { question: "I am a playwright who wrote Romeo and Juliet. What am I?", answer: "Shakespeare", },
  ],
  history: [
    { question: "I was the first President of the United States, leading from 1789 to 1797. Who am I?", answer: "George Washington",  },
    { question: "I was an ancient civilization that built the pyramids in Giza. What am I?", answer: "Egyptians",  },
    { question: "I was the French heroine known as the Maid of Orléans during the Hundred Years' War. Who am I?", answer: "Joan of Arc",  },
    { question: "I was the empire established by Genghis Khan in the 13th century. What am I?", answer: "Mongol Empire",  },
    { question: "I was the ship that carried the Pilgrims to America in 1620. What am I?", answer: "Mayflower",  },
    { question: "I was the British Prime Minister who led Britain through most of World War II. Who am I?", answer: "Winston Churchill",  },
    { question: "In which year did the Berlin Wall fall, marking the end of the Cold War era. What am I?", answer: "1989",  },
    { question: "I was the first person to walk on the moon in 1969. Who am I?", answer: "Neil Armstrong",  },
    { question: "I was the first permanent English settlement in America, founded in 1607. What am I?", answer: "Jamestown",  },
    { question: "I was the Egyptian queen who had relationships with Julius Caesar and Mark Antony. Who am I?", answer: "Cleopatra",  },
  ],
};

const QuizGame = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("front");
  const [gameMode, setGameMode] = useState(null);
  const [category, setCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [identificationAnswer, setIdentificationAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem("quizLeaderboard");
    return saved ? JSON.parse(saved) : [];
  });
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHintsByDefault, setShowHintsByDefault] = useState(true); // Default to showing hints


  const getTimerDuration = useCallback(() => gameMode === "identification" ? 30 : 10, [gameMode]);
  const getQuestionLimit = useCallback(() => gameMode === "multiple" ? 15 : 5, [gameMode]);

 
  const shuffleQuestions = useCallback((category, gameMode) => {
    let selectedQuestions = [];
    
    if (gameMode === "multiple") {
      const allQuestions = multipleChoiceQuestions[category] || [];
      const shuffled = shuffleArray(allQuestions);
      selectedQuestions = shuffled.slice(0, Math.min(15, shuffled.length));
      
      
      selectedQuestions = selectedQuestions.map(q => ({
        ...q,
        options: shuffleArray([...q.options])
      }));
    } else {
      const allQuestions = identificationQuestions[category] || [];
    const shuffled = shuffleArray(allQuestions);
    selectedQuestions = shuffled.slice(0, Math.min(5, shuffled.length));
  }
    
    return shuffleArray(selectedQuestions);
  }, [category, gameMode]);

  useEffect(() => {
    if (stage === "quiz") {
      const duration = getTimerDuration();
      setTimeLeft(duration);
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
  }, [stage, currentQuestion, getTimerDuration]);

  useEffect(() => {
    if (category && gameMode) {
      setIsLoading(true);
      
      const finalQuestions = shuffleQuestions(category, gameMode);
      setQuestions(finalQuestions);
      setCurrentQuestion(0);
      setIsLoading(false);
    }
  }, [category, gameMode, shuffleQuestions]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    const currentQ = questions[currentQuestion];
    if (currentQ && currentQ.options[index] === currentQ.answer) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleIdentificationSubmit = () => {
    const currentQ = questions[currentQuestion];
    if (!currentQ) return;
    
    const correctAnswer = currentQ.answer.toLowerCase();
    const userAnswer = identificationAnswer.toLowerCase().trim();
    
    if (userAnswer === correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

 

  const handleSkipQuestion = () => {
    setSelectedOption(true); 
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIdentificationAnswer("");
    setShowHint(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const newEntry = { category, gameMode, score, date: new Date().toLocaleString() };
      const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 5);
      setLeaderboard(updated);
      localStorage.setItem("quizLeaderboard", JSON.stringify(updated));
      setStage("results");
    }
  };

  const resetGame = () => {
    setStage("front");
    setGameMode(null);
    setCategory(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIdentificationAnswer("");
    setQuestions([]);
    setShowHint(false);
    setHintsUsed(0);
    setShowHintsByDefault(true);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">LOADING...</h1>
        </div>
        <div className="main-content">
          <div className="center-content">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <div style={{ fontSize: '2rem', color: '#0ff' }}>Loading questions...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "front") {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">QUIZ ARCADE</h1>
          <div className="timer">
            <span>⏱️</span>
            <span>00:00</span>
          </div>
        </div>
        
        <div className="main-content">
          <div className="side-panel">
            <h3 className="game-info">GAME INFO</h3>
            <div className="info-content">
              <p>Test your knowledge in various categories!</p>
              <p style={{ marginTop: '0.8rem' }}>🏆 High scores are saved locally</p>
              <p style={{ marginTop: '0.8rem' }}>⏱️ Multiple choice: 10s per question</p>
              <p style={{ marginTop: '0.8rem' }}>🔍 Identification: 30s per question</p>
              <p style={{ marginTop: '0.8rem' }}>🎯 Score points for correct answers</p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3 className="game-info">TIPS</h3>
              <div className="tips-content">
                <p>• Read questions carefully</p>
                <p>• Trust your instincts</p>
                <p>• Stay calm under pressure</p>
              </div>
            </div>
          </div>
          
          <div className="center-content">
            <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="decorative-element decorative-element-1"></div>
              <div className="decorative-element decorative-element-2"></div>
              
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', color: '#fff' }}>
                SELECT GAME MODE
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '600px', margin: '0 auto' }}>
                <div 
                  className="game-mode-card"
                  onClick={() => { setGameMode("multiple"); setStage("category"); }}
                >
                  <div className="category-icon">❓</div>
                  <div className="category-info">
                    <div className="category-title">MULTIPLE CHOICE</div>
                    <div className="category-desc">Answer questions by selecting the correct option (easy round)</div>
                  </div>
                </div>
                
                <div 
                  className="game-mode-card"
                  onClick={() => { setGameMode("identification"); setStage("category"); }}
                >
                  <div className="category-icon">🔍</div>
                  <div className="category-info">
                    <div className="category-title">IDENTIFICATION</div>
                    <div className="category-desc">Identify concepts based on descriptive clues (hard round)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="right-panel">
            <div className="leaderboard">
              <h3 className="leaderboard-title">🏆 LEADERBOARD</h3>
              {leaderboard.length === 0 ? (
                <p style={{ fontSize: '0.6rem', color: '#b0bec5', textAlign: 'center' }}>No scores yet. Be the first!</p>
              ) : (
                leaderboard.map((entry, i) => (
                  <div key={i} className="leaderboard-item">
                    <span>{i + 1}. {entry.category?.toUpperCase() || 'N/A'} ({entry.gameMode || 'N/A'})</span>
                    <span>{entry.score} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="footer">
          <button 
            className="button button-home"
            onClick={() => navigate('/home')}
          >
            🏠 HOME
          </button>
          
          <div className="version">
            QUIZ ARCADE v1.chate
          </div>
        </div>
      </div>
    );
  }

  if (stage === "category") {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">{gameMode === "multiple" ? "MULTIPLE CHOICE" : "IDENTIFICATION"}</h1>
          <div className="timer">
            <span>⏱️</span>
            <span>00:00</span>
          </div>
        </div>
        
        <div className="main-content">
          <div className="side-panel">
            <h3 className="game-info">GAME INFO</h3>
            <div className="info-content">
              <p>Mode: {gameMode === "multiple" ? "Multiple Choice" : "Identification"}</p>
              <p style={{ marginTop: '0.8rem' }}>🏆 High scores are saved locally</p>
              <p style={{ marginTop: '0.8rem' }}>⏱️ Time limit: {gameMode === "multiple" ? "10s" : "30s"} per question</p>
              <p style={{ marginTop: '0.8rem' }}>🎯 Score points for correct answers</p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3 className="game-info">TIPS</h3>
              <div className="tips-content">
                <p>• Read questions carefully</p>
                <p>• Trust your instincts</p>
                <p>• Stay calm under pressure</p>
              </div>
            </div>
          </div>
          
          <div className="center-content">
            <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="decorative-element decorative-element-1"></div>
              <div className="decorative-element decorative-element-2"></div>
              
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', color: '#fff' }}>
                SELECT CATEGORY
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '600px', margin: '0 auto' }}>
                <div 
                  className="category-card"
                  onClick={() => { 
                    setCategory("anatomy"); 
                    setStage("quiz"); 
                  }}
                >
                  <div className="category-icon">🧬</div>
                  <div className="category-info">
                    <div className="category-title">HUMAN ANATOMY</div>
                    <div className="category-desc">Test your knowledge of the human body and its systems</div>
                  </div>
                </div>
                
                <div 
                  className="category-card"
                  onClick={() => { 
                    setCategory("general"); 
                    setStage("quiz"); 
                  }}
                >
                  <div className="category-icon">🌍</div>
                  <div className="category-info">
                    <div className="category-title">GENERAL QUIZ</div>
                    <div className="category-desc">Challenge yourself with questions from various fields</div>
                  </div>
                </div>
                
                <div 
                  className="category-card"
                  onClick={() => { 
                    setCategory("history"); 
                    setStage("quiz"); 
                  }}
                >
                  <div className="category-icon">📜</div>
                  <div className="category-info">
                    <div className="category-title">HISTORY</div>
                    <div className="category-desc">Journey through time and test your historical knowledge</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="right-panel">
            <div className="leaderboard">
              <h3 className="leaderboard-title">🏆 LEADERBOARD</h3>
              {leaderboard.length === 0 ? (
                <p style={{ fontSize: '0.6rem', color: '#b0bec5', textAlign: 'center' }}>No scores yet. Be the first!</p>
              ) : (
                leaderboard.map((entry, i) => (
                  <div key={i} className="leaderboard-item">
                    <span>{i + 1}. {entry.category?.toUpperCase() || 'N/A'} ({entry.gameMode || 'N/A'})</span>
                    <span>{entry.score} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="footer">
          <button 
            className="button button-back"
            onClick={() => setStage("front")}
          >
            🏠 BACK TO MODES
          </button>
          
          <div className="version">
            QUIZ ARCADE v1.chate
          </div>
        </div>
      </div>
    );
  }

  if (stage === "quiz") {
    const isMultipleChoice = gameMode === "multiple";
    const questionObj = questions[currentQuestion];
    
    if (!questionObj) {
      return (
        <div className="container">
          <div className="header">
            <h1 className="title">ERROR</h1>
          </div>
          <div className="main-content">
            <div className="center-content">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{ fontSize: '1.5rem', color: '#ff4d4d' }}>No questions available</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const timerDuration = getTimerDuration();
    const questionLimit = getQuestionLimit();
    
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">{category.toUpperCase()} {isMultipleChoice ? "QUIZ" : "IDENTIFICATION"}</h1>
          <div className={`timer ${timeLeft <= (timerDuration * 0.3) ? 'warning' : ''}`}>
            <span>⏱️</span>
            <span>{timeLeft}s</span>
          </div>
        </div>
        
        <div className="main-content">
          <div className="side-panel">
            <h3 className="game-info">QUESTION INFO</h3>
            <div className="info-content">
              <p>Question {currentQuestion + 1} of {questions.length}</p>
              <p style={{ marginTop: '0.8rem' }}>Category: {category.toUpperCase()}</p>
              <p style={{ marginTop: '0.8rem' }}>Mode: {isMultipleChoice ? "Multiple Choice" : "Identification"}</p>
              <p style={{ marginTop: '0.8rem' }}>Time limit: {timerDuration}s</p>
              
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3 className="game-info">PROGRESS</h3>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
              <p style={{ fontSize: '0.6rem', color: '#b0bec5', textAlign: 'center', marginTop: '0.5rem' }}>
                {Math.round(progress)}% Complete
              </p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3 className="game-info">SCORE</h3>
              <div className="score-display">
                {score}
              </div>
            </div>
          </div>
          
          <div className="center-content">
            <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="decorative-element decorative-element-1"></div>
              <div className="decorative-element decorative-element-2"></div>
              
              <div className="question-card">
                <h3 className="question-title">
                  {questionObj.question}
                </h3>
                
                {isMultipleChoice ? (
                  <div>
                    {questionObj.options.map((option, index) => {
                      let buttonClass = "option-button";
                      
                      if (selectedOption !== null) {
                        if (option === questionObj.answer) {
                          buttonClass += " correct-option";
                        } else if (index === selectedOption) {
                          buttonClass += " wrong-option";
                        }
                      }
                      
                      return (
                        <button
                          key={index}
                          className={buttonClass}
                          onClick={() => handleOptionClick(index)}
                          disabled={selectedOption !== null}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <div className="identification-box">
                      <p className="identification-clue">
                        💡 Think carefully about the clues in the question and type your answer below
                      </p>
                      
                      
                    </div>
                    
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Type your answer here..."
                      value={identificationAnswer}
                      onChange={(e) => setIdentificationAnswer(e.target.value)}
                      disabled={selectedOption !== null}
                    />
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className={`button ${selectedOption !== null 
                          ? (identificationAnswer.toLowerCase().trim() === questionObj.answer.toLowerCase() 
                              ? 'correct-option' 
                              : 'wrong-option')
                          : ''}`}
                        style={{ flex: 1 }}
                        onClick={() => {
                          if (selectedOption === null) {
                            setSelectedOption(true);
                            handleIdentificationSubmit();
                          }
                        }}
                        disabled={selectedOption !== null}
                      >
                        SUBMIT
                      </button>
                     
                      
                      {selectedOption !== null && (
                        <button
                          className="button"
                          style={{ flex: 1, background: 'linear-gradient(145deg, #6c757d, #5a6268)' }}
                          onClick={handleSkipQuestion}
                          disabled={selectedOption !== null}
                        >
                          ⏭️ SKIP
                        </button>
                      )}
                    </div>
                    
                    {selectedOption !== null && (
                      <div className={`answer-feedback ${identificationAnswer.toLowerCase().trim() === questionObj.answer.toLowerCase() ? 'correct' : 'incorrect'}`}>
                        <p className="answer-text">
                          {identificationAnswer.toLowerCase().trim() === questionObj.answer.toLowerCase() 
                            ? '✓ Correct!' 
                            : `✗ Incorrect. The answer is: ${questionObj.answer}`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="right-panel">
            <div className="timer-panel">
              <h3 className="stats-title">TIMER</h3>
              <div className={`timer-display ${timeLeft <= (timerDuration * 0.3) ? 'warning' : ''}`}>
                {timeLeft}
              </div>
              <div className="progress">
                <div className={`progress-bar ${timeLeft <= (timerDuration * 0.3) ? 'warning' : ''}`} style={{ width: `${(timeLeft / timerDuration) * 100}%` }}></div>
              </div>
            </div>
            
            <div className="stats-panel">
              <h3 className="stats-title">STATS</h3>
              <div className="stats-content">
                <p>Correct: {score}</p>
                <p>Remaining: {questions.length - currentQuestion - 1}</p>
                <p>Accuracy: {currentQuestion > 0 ? Math.round((score / currentQuestion) * 100) : 0}%</p>
              </div>
            </div>
            
            <div className="tips-panel">
              <h3 className="stats-title">TIPS</h3>
              <div className="tips-content">
                <p>• Read carefully</p>
                <p>• Stay focused</p>
                <p>• Trust your gut</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer">
          <button 
            className="button button-back"
            onClick={resetGame}
          >
            🏠 BACK TO GAME MODE
          </button>
          
          <div className="version">
            QUIZ ARCADE v1.chate
          </div>
        </div>
      </div>
    );
  }

  if (stage === "results") {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">QUIZ RESULTS</h1>
          <div className="timer">
            <span>🏆</span>
            <span>{percentage}%</span>
          </div>
        </div>
        
        <div className="main-content">
          <div className="side-panel">
            <h3 className="game-info">PERFORMANCE</h3>
            <div className="info-content">
              <p>Category: {category.toUpperCase()}</p>
              <p>Mode: {gameMode === "multiple" ? "Multiple Choice" : "Identification"}</p>
              <p style={{ marginTop: '0.8rem' }}>Correct: {score}/{questions.length}</p>
              <p style={{ marginTop: '0.8rem' }}>Accuracy: {percentage}%</p>
              {!gameMode === "multiple" && (
                <p style={{ marginTop: '0.8rem' }}>Hints used: {hintsUsed}/{getQuestionLimit()}</p>
              )}
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3 className="game-info">ACHIEVEMENT</h3>
              <div className={`achievement ${percentage >= 80 ? 'gold' : percentage >= 60 ? 'silver' : 'bronze'}`}>
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : '🥉'}
              </div>
            </div>
          </div>
          
          <div className="center-content">
            <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="decorative-element decorative-element-1"></div>
              <div className="decorative-element decorative-element-2"></div>
              
              <div className="question-card">
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', color: '#fff' }}>
                  QUIZ COMPLETED!
                </h2>
                
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div className="result-message">
                    {score}/{questions.length}
                  </div>
                  <div className="result-description">
                    {percentage >= 80 
                      ? "🏆 Outstanding! You're a quiz master!" 
                      : percentage >= 60 
                        ? "🎉 Good job! You know your stuff!" 
                        : "📚 Keep learning and try again!"
                    }
                  </div>
                </div>
                
                <div className="button-group">
                  <button 
                    className="button button-play"
                    onClick={resetGame}
                  >
                    🔄 PLAY AGAIN
                  </button>
                  
                  <button 
                    className="button button-back"
                    onClick={resetGame}
                  >
                    🏠 CATEGORIES
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="right-panel">
            <div className="leaderboard">
              <h3 className="leaderboard-title">🏆 LEADERBOARD</h3>
              {leaderboard.length === 0 ? (
                <p style={{ fontSize: '0.6rem', color: '#b0bec5', textAlign: 'center' }}>No scores yet. Be the first!</p>
              ) : (
                leaderboard.map((entry, i) => (
                  <div key={i} className={`leaderboard-item ${entry.category === category && entry.gameMode === gameMode && entry.score === score ? 'highlight' : ''}`}>
                    <span>{i + 1}. {entry.category?.toUpperCase() || 'N/A'} ({entry.gameMode || 'N/A'})</span>
                    <span>{entry.score} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="footer">
          <button 
            className="button button-home"
            onClick={() => navigate('/home')}
          >
            🏠 HOME
          </button>
          
          <div className="version">
            QUIZ ARCADE v1.chate
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">ERROR</h1>
      </div>
      <div className="main-content">
        <div className="center-content">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ fontSize: '1.5rem', color: '#ff4d4d' }}>Something went wrong. Please refresh the page.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;