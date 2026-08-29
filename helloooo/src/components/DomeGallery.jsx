import React, { useState, useEffect } from 'react';

// --- API Configuration ---
const API_BASE_URL = 'https://quiz-backend-6hgf.onrender.com/api'
const API_HEADERS = {
  'Content-Type': 'application/json'
};

const colors = {
  purple: '#46178f',
  green: '#26890c',
  blue: '#1368ce',
  correctGreen: '#66bf39',
  incorrectRed: '#ff3355',
  white: '#ffffff',
  dark: '#333333',
  yellow: '#ffc107',
  gray: '#f2f2f2'
};

// Inject keyframe animations for login hearts
const heartStyleSheet = document.createElement('style');
heartStyleSheet.textContent = `
  @keyframes floatHeart {
    0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
    50% { opacity: 0.8; }
    100% { transform: translateY(-100vh) scale(1.3) rotate(25deg); opacity: 0; }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
document.head.appendChild(heartStyleSheet);

const heartPositions = [
  { left: '5%', bottom: '-10%', delay: '0s', duration: '6s', size: '2rem' },
  { left: '15%', bottom: '-15%', delay: '1s', duration: '8s', size: '1.5rem' },
  { left: '30%', bottom: '-10%', delay: '2.5s', duration: '7s', size: '2.5rem' },
  { left: '50%', bottom: '-12%', delay: '0.5s', duration: '9s', size: '1.8rem' },
  { left: '65%', bottom: '-10%', delay: '3s', duration: '6.5s', size: '2.2rem' },
  { left: '80%', bottom: '-15%', delay: '1.5s', duration: '7.5s', size: '1.6rem' },
  { left: '90%', bottom: '-10%', delay: '4s', duration: '8.5s', size: '2rem' },
  { left: '42%', bottom: '-12%', delay: '2s', duration: '7s', size: '1.4rem' },
];

const styles = {
  page: {
    backgroundColor: colors.purple, minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '2rem', fontFamily: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: colors.white,
  },
  header: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem',
    width: '100%', maxWidth: '1000px', marginBottom: '2rem'
  },
  quizSquare: {
    backgroundColor: colors.white, color: colors.dark, padding: '2rem 1rem', borderRadius: '8px',
    textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 6px 0 #cccccc', transition: 'transform 0.1s', display: 'flex',
    alignItems: 'center', justifyContent: 'center', minHeight: '150px', position: 'relative'
  },
  deleteBtn: {
    position: 'absolute', top: '10px', right: '10px', backgroundColor: colors.incorrectRed,
    color: colors.white, border: 'none', borderRadius: '50%', width: '30px', height: '30px',
    cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center',
    justifyContent: 'center', boxShadow: '0 3px 0 #b3243b', fontSize: '1rem'
  },
  btnPrimary: {
    backgroundColor: colors.green, color: colors.white, border: 'none', padding: '1rem 2.5rem',
    fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 4px 0 #1a5c08',
  },
  btnWarning: {
    backgroundColor: colors.incorrectRed, color: colors.white, border: 'none', padding: '0.8rem 1.5rem',
    fontSize: '1rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer',
  },
  copyBtn: {
    backgroundColor: colors.blue, color: colors.white, border: 'none', padding: '0.8rem 1.5rem',
    fontSize: '1rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem',
    boxShadow: '0 4px 0 #0d468a', transition: 'background-color 0.2s ease',
  },
  inputArea: {
    width: '100%', maxWidth: '700px', height: '350px', padding: '1rem', borderRadius: '8px',
    border: 'none', fontSize: '1rem', marginBottom: '1rem', fontFamily: 'monospace', resize: 'vertical',
  },
  card: {
    backgroundColor: colors.green, width: '100%', maxWidth: '800px', padding: '3rem 2rem',
    borderRadius: '8px', textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold',
    boxShadow: '0 4px 0 #1a5c08', marginBottom: '2rem', position: 'relative',
  },
  importantBadge: {
    position: 'absolute', top: '-15px', right: '-15px', backgroundColor: colors.incorrectRed,
    color: colors.white, padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '1rem',
    fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', textTransform: 'uppercase',
  },
  choiceGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem',
    width: '100%', maxWidth: '800px',
  },
  choice: {
    backgroundColor: colors.blue, color: colors.white, padding: '1.5rem', fontSize: '1.2rem',
    fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer',
    boxShadow: '0 4px 0 #0d468a', display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', minHeight: '120px',
  },
  choiceCorrect: { backgroundColor: colors.correctGreen, boxShadow: '0 4px 0 #4a8c29' },
  choiceIncorrect: { backgroundColor: colors.incorrectRed, boxShadow: '0 4px 0 #b3243b' },
  choiceDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  controls: { display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginTop: '2rem', alignItems: 'center' },
  controlBtn: { backgroundColor: colors.dark, color: colors.white, border: 'none', padding: '0.8rem 1.5rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' },
  explanationBtn: {
    backgroundColor: colors.yellow, color: colors.dark, border: 'none', borderRadius: '50%',
    width: '50px', height: '50px', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 4px 0 #cc9a06', marginLeft: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  explanationBox: { backgroundColor: colors.white, color: colors.dark, width: '100%', maxWidth: '800px', padding: '1.5rem', borderRadius: '8px', marginTop: '1.5rem', fontSize: '1.1rem', lineHeight: '1.5' },
  errorMsg: { backgroundColor: colors.incorrectRed, color: colors.white, padding: '1rem', borderRadius: '4px', marginBottom: '1rem' },
  // Login page styles
  loginContainer: {
    position: 'relative', overflow: 'hidden', backgroundColor: colors.purple, minHeight: '100vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    fontFamily: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif', color: colors.white,
  },
  loginBox: {
    zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
  },
  loginTitle: {
    fontSize: '2.8rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem',
  },
  loginInput: {
    width: '300px', padding: '1rem 1.5rem', borderRadius: '8px', border: 'none',
    fontSize: '1.3rem', textAlign: 'center', fontFamily: '"Montserrat", sans-serif',
    outline: 'none', color: colors.dark,
  },
  loginError: {
    fontSize: '1.2rem', color: colors.incorrectRed, fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.5rem 1.5rem', borderRadius: '20px',
  },
  // Progress bar styles
  progressContainer: {
    display: 'flex', alignItems: 'center', width: '100%', maxWidth: '800px', marginBottom: '1.5rem', gap: '1rem',
  },
  progressBar: {
    display: 'flex', flex: 1, height: '16px', borderRadius: '8px', overflow: 'hidden',
    backgroundColor: '#3a1070',
  },
  progressSegment: {
    height: '100%', transition: 'background-color 0.3s ease',
  },
  progressScore: {
    fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: '60px', textAlign: 'right',
  },
};

const AI_PROMPT_TEXT = `I am going to upload a PowerPoint presentation. Please read the content, including handwritten notes, circled items, and text colors, and generate a multiple-choice quiz.

Content Priority Rules:

High Priority (Test Questions): If a slide contains text like "test question", "test q", "on the test", is circled, or is written in red, mark "isImportant": true. Generate 2-3 thorough questions for this concept.

High Priority (Whole Slide): If a slide says "memorize whole slide", "know the whole slide", or "important", generate comprehensive questions covering the entire slide. Mark "isImportant": true.

Standard Priority: For all other informational slides, generate standard questions and mark "isImportant": false.

Answer Quality Rules (CRITICAL — follow these strictly):

1. ALL OPTIONS MUST BE SIMILAR IN LENGTH. The correct answer should never be noticeably longer or shorter than the wrong answers. If the correct answer is a full sentence, make all distractors full sentences of similar length. If it's a short phrase, keep all options short.

2. DISTRACTORS MUST BE HIGHLY PLAUSIBLE. Wrong answers should sound medically/scientifically accurate and be closely related to the correct concept. Use real terminology from the same domain. A student who didn't study should not be able to guess the answer by elimination.

3. RANDOMIZE the position of the correct answer. Do NOT always place the correct answer at the same index. Distribute correctIndex values (0, 1, 2, 3) roughly evenly across all questions.

4. AVOID "All of the above", "None of the above", or "Both A and B" style options.

5. Make wrong answers reference real concepts from nearby slides or related topics so they feel like genuine alternatives, not obvious filler.

Output Rules:
Output strictly as a raw JSON object containing a title and an array of questions. Do not include markdown formatting.

Use this exact schema:
{
"title": "A short, descriptive title based on the presentation topic",
"questions": [
{
"id": "A unique string ID for this question (e.g., q_1, q_2)",
"question": "Insert question text here",
"options": ["Option 1", "Option 2", "Option 3", "Option 4"],
"correctIndex": 0,
"isImportant": true,
"explanation": "Explain exactly why this answer is correct based on the slide content."
}
]
}`;

export default function QuizApp() {
  const [gameState, setGameState] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true' ? 'home' : 'login';
  });
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Login state
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginShake, setLoginShake] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/quizzes`);
      if (!res.ok) throw new Error('Failed to connect to database');
      const data = await res.json();
      setQuizzes(data);
    } catch (err) {
      setError('Could not load quizzes. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(AI_PROMPT_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy to clipboard. Please copy manually.');
    });
  };

  const handleSaveNewQuiz = async () => {
    setSaving(true);
    setError('');
    try {
      let clean = inputText.trim();
      if (clean.startsWith('```json')) clean = clean.substring(7);
      if (clean.startsWith('```')) clean = clean.substring(3);
      if (clean.endsWith('```')) clean = clean.slice(0, -3);
      
      const parsedData = JSON.parse(clean.trim());
      parsedData.userAnswers = {};

      const res = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(parsedData)
      });

      if (!res.ok) throw new Error('Failed to save to database');
      
      const savedQuiz = await res.json();
      setQuizzes([savedQuiz, ...quizzes]);
      setInputText('');
      
      // Start the quiz directly instead of going to the home screen
      startQuiz(savedQuiz);
    } catch (err) {
      setError("Failed to save. Ensure your AI output is valid JSON and the server is running.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuiz = async (e, id) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this quiz? This cannot be undone.")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'DELETE',
        headers: API_HEADERS
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      
      setQuizzes(quizzes.filter(quiz => quiz._id !== id));
    } catch (err) {
      setError("Failed to delete quiz. Ensure backend is running.");
    }
  };

  const saveProgressToDB = async (quizId, updatedAnswers) => {
    try {
      await fetch(`${API_BASE_URL}/quizzes/${quizId}/answers`, {
        method: 'PUT',
        headers: API_HEADERS,
        body: JSON.stringify({ userAnswers: updatedAnswers })
      });
    } catch (err) {
      console.error("Failed to save progress to cloud", err);
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = (quiz) => {
    const shuffledQuestions = shuffleArray(quiz.questions);
    setCurrentQuiz({ ...quiz, questions: shuffledQuestions });
    setUserAnswers(quiz.userAnswers || {});
    setCurrentIndex(0);
    setShowExplanation(false);
    setGameState('quiz');
  };

  const handleChoiceClick = (optionIndex) => {
    const qId = currentQuiz.questions[currentIndex].id;
    if (userAnswers[qId] !== undefined) return; 
    
    const updatedAnswers = { ...userAnswers, [qId]: optionIndex };
    setUserAnswers(updatedAnswers);
    saveProgressToDB(currentQuiz._id, updatedAnswers);
  };

  const handleResetQuiz = () => {
    if(window.confirm("Are you sure you want to clear your previous answers and retake this quiz?")) {
      setUserAnswers({});
      saveProgressToDB(currentQuiz._id, {});
      setCurrentIndex(0);
      setShowExplanation(false);
    }
  };

  const getChoiceStyle = (index, currentQ) => {
    let baseStyle = { ...styles.choice };
    const qId = currentQ.id;
    const hasAnswered = userAnswers[qId] !== undefined;
    const isCorrectChoice = index === currentQ.correctIndex;
    const isUserChoice = index === userAnswers[qId];

    if (hasAnswered) {
      baseStyle = { ...baseStyle, ...styles.choiceDisabled };
      if (isCorrectChoice) baseStyle = { ...baseStyle, ...styles.choiceCorrect, opacity: 1 };
      else if (isUserChoice) baseStyle = { ...baseStyle, ...styles.choiceIncorrect, opacity: 1 };
    }
    return baseStyle;
  };

  // --- Render ---

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPassword.trim().toLowerCase() === 'eimo') {
      localStorage.setItem('isLoggedIn', 'true');
      setGameState('home');
      setLoginError(false);
      setLoginPassword('');
    } else {
      setLoginError(true);
      setLoginShake(true);
      setLoginPassword('');
      setTimeout(() => setLoginShake(false), 500);
    }
  };

  if (gameState === 'login') {
    return (
      <div style={styles.loginContainer}>
        {/* Floating hearts */}
        {heartPositions.map((heart, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: heart.left,
              bottom: heart.bottom,
              fontSize: heart.size,
              animation: `floatHeart ${heart.duration} ${heart.delay} infinite ease-in`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            ❤️
          </div>
        ))}

        <div style={styles.loginBox}>
          <div style={{ fontSize: '4rem', animation: 'pulse 2s infinite ease-in-out' }}>💖</div>
          <h1 style={styles.loginTitle}>What's the magic word?</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <input
              type="text"
              value={loginPassword}
              onChange={(e) => { setLoginPassword(e.target.value); setLoginError(false); }}
              style={{
                ...styles.loginInput,
                animation: loginShake ? 'shake 0.5s ease' : 'none',
              }}
              placeholder="Type here..."
              autoFocus
            />
            <button type="submit" style={{ ...styles.btnPrimary, animation: 'pulse 2s infinite ease-in-out' }}>
              💕 Enter 💕
            </button>
          </form>
          {loginError && (
            <div style={styles.loginError}>Try again 💔</div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'home') {
    return (
      <div style={styles.page}>
        <h1 style={styles.header}>My Presentation Quizzes</h1>
        
        {error && <div style={styles.errorMsg}>{error}</div>}
        
        {loading ? (
          <p style={{marginBottom: '2rem', fontSize: '1.2rem'}}>Connecting to database... (Render servers may take 30s to wake up)</p>
        ) : quizzes.length === 0 ? (
          <p style={{marginBottom: '2rem', fontSize: '1.2rem'}}>No quizzes found in the database. Let's create one!</p>
        ) : (
          <div style={styles.grid}>
            {quizzes.map((quiz) => (
              <div key={quiz._id} style={styles.quizSquare} onClick={() => startQuiz(quiz)}>
                <button 
                  style={styles.deleteBtn} 
                  onClick={(e) => handleDeleteQuiz(e, quiz._id)}
                  title="Delete Quiz"
                >
                  ✕
                </button>
                {quiz.title}
              </div>
            ))}
          </div>
        )}

        <button style={styles.btnPrimary} onClick={() => setGameState('create')}>
          + Create New Quiz
        </button>
      </div>
    );
  }

  if (gameState === 'create') {
    return (
      <div style={styles.page}>
        <h1 style={styles.header}>Paste AI Output</h1>
        {error && <div style={styles.errorMsg}>{error}</div>}
        
        <button 
          style={{
            ...styles.copyBtn,
            backgroundColor: copied ? colors.correctGreen : colors.blue,
            boxShadow: copied ? '0 4px 0 #4a8c29' : '0 4px 0 #0d468a'
          }} 
          onClick={handleCopyPrompt}
        >
          {copied ? '✅ Copied to Clipboard!' : '📋 Copy AI Prompt'}
        </button>

        <textarea
          style={styles.inputArea}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='{ "title": "...", "questions": [...] }'
        />
        <div style={{display: 'flex', gap: '1rem'}}>
          <button style={styles.controlBtn} onClick={() => setGameState('home')} disabled={saving}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSaveNewQuiz} disabled={saving}>
            {saving ? 'Saving to Database...' : 'Save & Start'}
          </button>
        </div>
      </div>
    );
  }

  const currentQ = currentQuiz.questions[currentIndex];
  const qId = currentQ?.id;
  const hasAnswered = userAnswers[qId] !== undefined;

  // Compute progress bar data
  const totalQuestions = currentQuiz.questions.length;
  const correctCount = currentQuiz.questions.filter(q => {
    const answer = userAnswers[q.id];
    return answer !== undefined && answer === q.correctIndex;
  }).length;

  return (
    <div style={styles.page}>
      <div style={{...styles.controls, marginTop: 0, marginBottom: '2rem'}}>
        <button style={styles.controlBtn} onClick={() => { setGameState('home'); fetchQuizzes(); }}>◄ Back to Home</button>
        <button style={styles.btnWarning} onClick={handleResetQuiz}>↻ Reset Quiz</button>
      </div>

      {/* Progress Bar + Score */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          {currentQuiz.questions.map((q, i) => {
            const answer = userAnswers[q.id];
            let segColor = '#555'; // unanswered - dark gray
            if (answer !== undefined) {
              segColor = answer === q.correctIndex ? colors.correctGreen : colors.incorrectRed;
            }
            return (
              <div
                key={q.id || i}
                style={{
                  ...styles.progressSegment,
                  flex: 1,
                  backgroundColor: segColor,
                  borderRight: i < totalQuestions - 1 ? '1px solid rgba(0,0,0,0.2)' : 'none',
                  outline: i === currentIndex ? '2px solid white' : 'none',
                  outlineOffset: '-1px',
                  position: 'relative',
                  zIndex: i === currentIndex ? 1 : 0,
                }}
              />
            );
          })}
        </div>
        <div style={styles.progressScore}>
          {correctCount}/{totalQuestions}
        </div>
      </div>

      <div style={styles.card}>
        {currentQ.isImportant && <div style={styles.importantBadge}>⭐ High Priority</div>}
        {currentQ.question}
      </div>

      <div style={styles.choiceGrid}>
        {currentQ.options.map((option, index) => (
          <button key={index} style={getChoiceStyle(index, currentQ)} onClick={() => handleChoiceClick(index)}>
            {option}
          </button>
        ))}
      </div>

      {hasAnswered && currentQ.explanation && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', width: '100%' }}>
            <button style={styles.explanationBtn} onClick={() => setShowExplanation(!showExplanation)}>?</button>
          </div>
          {showExplanation && (
            <div style={styles.explanationBox}>
              <strong>Explanation:</strong> <br/>{currentQ.explanation}
            </div>
          )}
        </>
      )}

      <div style={styles.controls}>
        <button 
          style={{...styles.controlBtn, opacity: currentIndex === 0 ? 0 : 1}} 
          onClick={() => { setCurrentIndex(currentIndex - 1); setShowExplanation(false); }}
          disabled={currentIndex === 0}
        >◄ Back</button>
        <span style={{fontWeight: 'bold'}}>Question {currentIndex + 1} of {currentQuiz.questions.length}</span>
        <button 
          style={{...styles.controlBtn, opacity: currentIndex === currentQuiz.questions.length - 1 ? 0 : 1}} 
          onClick={() => { setCurrentIndex(currentIndex + 1); setShowExplanation(false); }}
          disabled={currentIndex === currentQuiz.questions.length - 1}
        >Next ►</button>
      </div>
    </div>
  );
}