import React, { useState } from 'react';

// Centralized Kahoot-inspired Color Palette
const colors = {
  purple: '#46178f',
  green: '#26890c',
  blue: '#1368ce',
  correctGreen: '#66bf39',
  incorrectRed: '#ff3355',
  white: '#ffffff',
  dark: '#333333',
};

const styles = {
  page: {
    backgroundColor: colors.purple,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    fontFamily: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: colors.white,
  },
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  inputArea: {
    width: '100%',
    maxWidth: '700px',
    height: '350px',
    padding: '1rem',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    marginBottom: '1rem',
    fontFamily: 'monospace',
    resize: 'vertical',
  },
  btnPrimary: {
    backgroundColor: colors.white,
    color: colors.dark,
    border: 'none',
    padding: '1rem 2.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: '0 4px 0 #cccccc',
  },
  card: {
    backgroundColor: colors.green,
    width: '100%',
    maxWidth: '800px',
    padding: '3rem 2rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 0 #1a5c08',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    width: '100%',
    maxWidth: '800px',
  },
  choice: {
    backgroundColor: colors.blue,
    color: colors.white,
    padding: '1.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: '0 4px 0 #0d468a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '120px',
    transition: 'all 0.1s ease',
  },
  choiceCorrect: {
    backgroundColor: colors.correctGreen,
    boxShadow: '0 4px 0 #4a8c29',
  },
  choiceIncorrect: {
    backgroundColor: colors.incorrectRed,
    boxShadow: '0 4px 0 #b3243b',
  },
  choiceDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '800px',
    marginTop: '2rem',
    alignItems: 'center',
  },
  controlBtn: {
    backgroundColor: colors.dark,
    color: colors.white,
    border: 'none',
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  scoreBoard: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
  },
  error: {
    color: colors.incorrectRed,
    backgroundColor: colors.white,
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontWeight: 'bold',
  }
};

export default function QuizApp() {
  const [gameState, setGameState] = useState('home'); // 'home', 'quiz'
  const [inputText, setInputText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Stores answers as { questionIndex: selectedOptionIndex }
  const [errorMsg, setErrorMsg] = useState('');

  // Strips markdown wrappers in case the AI includes them anyway
  const sanitizeJSON = (input) => {
    let clean = input.trim();
    if (clean.startsWith('```json')) clean = clean.substring(7);
    if (clean.startsWith('```')) clean = clean.substring(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    return clean.trim();
  };

  const handleStart = () => {
    try {
      const cleanData = sanitizeJSON(inputText);
      const parsedData = JSON.parse(cleanData);
      
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        throw new Error("Input must be a valid JSON array.");
      }
      
      setQuestions(parsedData);
      setGameState('quiz');
      setCurrentIndex(0);
      setUserAnswers({});
      setErrorMsg('');
    } catch (error) {
      setErrorMsg("Invalid JSON format. Check your AI output. Details: " + error.message);
    }
  };

  const handleChoiceClick = (optionIndex) => {
    // Prevent changing answer if already answered
    if (userAnswers[currentIndex] !== undefined) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const getChoiceStyle = (index, currentQ) => {
    let baseStyle = { ...styles.choice };
    const hasAnswered = userAnswers[currentIndex] !== undefined;
    const isCorrectChoice = index === currentQ.correctIndex;
    const isUserChoice = index === userAnswers[currentIndex];

    if (hasAnswered) {
      baseStyle = { ...baseStyle, ...styles.choiceDisabled };
      
      if (isCorrectChoice) {
        // Always reveal correct answer in green
        baseStyle = { ...baseStyle, ...styles.choiceCorrect, opacity: 1 };
      } else if (isUserChoice) {
        // Highlight wrong user selection in red
        baseStyle = { ...baseStyle, ...styles.choiceIncorrect, opacity: 1 };
      }
    }
    return baseStyle;
  };

  const calculateScore = () => {
    return Object.keys(userAnswers).filter(
      (key) => userAnswers[key] === questions[key].correctIndex
    ).length;
  };

  // --- Home Screen ---
  if (gameState === 'home') {
    return (
      <div style={styles.page}>
        <h1 style={styles.header}>AI Presentation Quiz Maker</h1>
        <p style={{ marginBottom: '1rem' }}>Paste your AI-generated JSON below:</p>
        
        {errorMsg && <div style={styles.error}>{errorMsg}</div>}
        
        <textarea
          style={styles.inputArea}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="[\n  {\n    'question': '...',\n    'options': [...],\n    'correctIndex': 0\n  }\n]"
        />
        <button style={styles.btnPrimary} onClick={handleStart}>
          Load Quiz
        </button>
      </div>
    );
  }

  // --- Quiz Screen ---
  const currentQ = questions[currentIndex];
  const totalAnswered = Object.keys(userAnswers).length;

  return (
    <div style={styles.page}>
      
      <div style={{...styles.controls, marginTop: 0, marginBottom: '2rem'}}>
        <button style={styles.controlBtn} onClick={() => setGameState('home')}>
          Exit Game
        </button>
        <div style={styles.scoreBoard}>
          Score: {calculateScore()} / {totalAnswered}
        </div>
      </div>

      <div style={styles.card}>
        {currentQ.question}
      </div>

      <div style={styles.grid}>
        {currentQ.options.map((option, index) => (
          <button
            key={index}
            style={getChoiceStyle(index, currentQ)}
            onClick={() => handleChoiceClick(index)}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={styles.controls}>
        <button 
          style={{...styles.controlBtn, opacity: currentIndex === 0 ? 0 : 1}} 
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          ◄ Back
        </button>
        
        <span style={{fontWeight: 'bold'}}>
          Question {currentIndex + 1} of {questions.length}
        </span>

        <button 
          style={{...styles.controlBtn, opacity: currentIndex === questions.length - 1 ? 0 : 1}} 
          onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
          disabled={currentIndex === questions.length - 1}
        >
          Next ►
        </button>
      </div>
    </div>
  );
}