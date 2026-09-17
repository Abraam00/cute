import React, { useState, useEffect } from 'react';

// --- API Configuration ---
const API_BASE_URL = 'https://quiz-backend-6hgf.onrender.com/api';
const API_HEADERS = {
  'Content-Type': 'application/json'
};

const colors = {
  purple: '#46178f',
  darkPurple: '#2d0e5c',
  cardPurple: '#5a22b0',
  green: '#26890c',
  blue: '#1368ce',
  correctGreen: '#66bf39',
  incorrectRed: '#ff3355',
  white: '#ffffff',
  dark: '#333333',
  yellow: '#ffc107',
  gray: '#f2f2f2',
  lightGray: '#e0e0e0',
  darkGray: '#555555'
};

// Inject keyframe animations for login hearts and UI feedback
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
    50% { transform: scale(1.08); }
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
    alignItems: 'center', padding: '2rem 1rem', fontFamily: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: colors.white, boxSizing: 'border-box',
  },
  header: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' },
  subHeader: { fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem', textAlign: 'center' },
  sectionTitle: {
    fontSize: '1.8rem', fontWeight: 'bold', margin: '2rem 0 1rem 0', width: '100%',
    maxWidth: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem'
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem',
    width: '100%', maxWidth: '1000px', marginBottom: '1.5rem'
  },
  cardSquare: {
    backgroundColor: colors.white, color: colors.dark, padding: '2rem 1.2rem', borderRadius: '12px',
    textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 6px 0 #cccccc', transition: 'transform 0.15s, box-shadow 0.15s', display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '140px', position: 'relative'
  },
  testCardSquare: {
    backgroundColor: '#fff8e1', color: colors.dark, padding: '2rem 1.2rem', borderRadius: '12px',
    textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 6px 0 #ffd54f', transition: 'transform 0.15s, box-shadow 0.15s', display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '140px', position: 'relative',
    border: '2px solid #ffc107'
  },
  cardSubtext: {
    fontSize: '0.95rem', fontWeight: 'normal', color: '#666666', marginTop: '0.5rem'
  },
  deleteBtn: {
    position: 'absolute', top: '10px', right: '10px', backgroundColor: colors.incorrectRed,
    color: colors.white, border: 'none', borderRadius: '50%', width: '28px', height: '28px',
    cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center',
    justifyContent: 'center', boxShadow: '0 3px 0 #b3243b', fontSize: '0.9rem', zIndex: 3
  },
  btnPrimary: {
    backgroundColor: colors.green, color: colors.white, border: 'none', padding: '0.9rem 2rem',
    fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 0 #1a5c08',
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    backgroundColor: colors.blue, color: colors.white, border: 'none', padding: '0.9rem 2rem',
    fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 0 #0d468a',
  },
  btnYellow: {
    backgroundColor: colors.yellow, color: colors.dark, border: 'none', padding: '0.9rem 2rem',
    fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 0 #cc9a06',
  },
  btnWarning: {
    backgroundColor: colors.incorrectRed, color: colors.white, border: 'none', padding: '0.8rem 1.5rem',
    fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 0 #b3243b'
  },
  copyBtn: {
    backgroundColor: colors.blue, color: colors.white, border: 'none', padding: '0.8rem 1.2rem',
    fontSize: '0.95rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer',
    boxShadow: '0 4px 0 #0d468a', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'
  },
  inputArea: {
    width: '100%', maxWidth: '750px', height: '320px', padding: '1rem', borderRadius: '8px',
    border: 'none', fontSize: '1rem', marginBottom: '1.5rem', fontFamily: 'monospace', resize: 'vertical',
    boxSizing: 'border-box'
  },
  card: {
    backgroundColor: colors.green, width: '100%', maxWidth: '800px', padding: '3rem 2rem',
    borderRadius: '12px', textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold',
    boxShadow: '0 4px 0 #1a5c08', marginBottom: '2rem', position: 'relative', boxSizing: 'border-box'
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
    fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer',
    boxShadow: '0 4px 0 #0d468a', display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', minHeight: '110px',
  },
  choiceCorrect: { backgroundColor: colors.correctGreen, boxShadow: '0 4px 0 #4a8c29' },
  choiceIncorrect: { backgroundColor: colors.incorrectRed, boxShadow: '0 4px 0 #b3243b' },
  choiceDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  controls: { display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginTop: '2rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  controlBtn: { backgroundColor: colors.dark, color: colors.white, border: 'none', padding: '0.8rem 1.5rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' },
  explanationBtn: {
    backgroundColor: colors.yellow, color: colors.dark, border: 'none', borderRadius: '50%',
    width: '50px', height: '50px', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 4px 0 #cc9a06', marginLeft: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  explanationBox: { backgroundColor: colors.white, color: colors.dark, width: '100%', maxWidth: '800px', padding: '1.5rem', borderRadius: '8px', marginTop: '1.5rem', fontSize: '1.1rem', lineHeight: '1.5', boxSizing: 'border-box' },
  errorMsg: { backgroundColor: colors.incorrectRed, color: colors.white, padding: '1rem', borderRadius: '8px', marginBottom: '1rem', maxWidth: '800px', width: '100%', textAlign: 'center', boxSizing: 'border-box' },
  
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
    height: '100%', transition: 'background-color 0.3s ease', cursor: 'pointer',
  },
  progressScore: {
    fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: '60px', textAlign: 'right',
  },

  // Modal styles
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
  },
  modalContent: {
    backgroundColor: colors.white, color: colors.dark, padding: '2rem', borderRadius: '12px',
    maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)', boxSizing: 'border-box'
  },
  textInput: {
    padding: '0.9rem 1.2rem', borderRadius: '8px', border: '2px solid #ddd', fontSize: '1.1rem',
    outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit'
  },

  // Test config styles
  configCard: {
    backgroundColor: colors.white, color: colors.dark, borderRadius: '12px', padding: '2rem',
    width: '100%', maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '1.5rem',
    boxShadow: '0 6px 0 #cccccc', boxSizing: 'border-box', marginBottom: '2rem'
  },
  quizConfigRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 0',
    borderBottom: '1px solid #eee', gap: '1rem'
  },
  numberInput: {
    width: '80px', padding: '0.6rem', borderRadius: '6px', border: '2px solid #ccc',
    fontSize: '1.1rem', textAlign: 'center', fontWeight: 'bold'
  }
};

const PPTX_AI_PROMPT_TEXT = `I am going to upload a PowerPoint presentation. Please read the content, including handwritten notes, circled items, and text colors, and generate a multiple-choice quiz.

========================
CONTENT PRIORITY RULES:
========================
1. High Priority (Test Questions): If a slide contains text like "test question", "test q", "on the test", is circled, or is written in red, mark "isImportant": true. Generate 2-3 thorough questions for this concept.
2. High Priority (Whole Slide): If a slide says "memorize whole slide", "know the whole slide", or "important", generate comprehensive questions covering the entire slide. Mark "isImportant": true.
3. Standard Priority: For all other informational slides, generate standard questions and mark "isImportant": false.

===============================================
ANSWER QUALITY RULES (CRITICAL - STRICTLY FOLLOW):
===============================================
1. ALL OPTIONS MUST BE SIMILAR IN LENGTH. The correct answer must NEVER be noticeably longer or shorter than the wrong answers. If the correct answer is a sentence, make all 4 choices sentences of similar length.
2. DISTRACTORS MUST BE HIGHLY PLAUSIBLE. Use real medical/scientific terminology from the subject. Wrong answers must feel authentic so students cannot guess by elimination.
3. RANDOMIZE THE CORRECT ANSWER POSITION. Do not always place the correct answer first. Distribute correctIndex (0, 1, 2, 3) evenly across all questions.
4. DO NOT USE "All of the above", "None of the above", or "Both A and B".
5. Distractors should reference real concepts from adjacent slides or topics.

====================================================
FORMATTING & SYNTAX RULES (CRITICAL FOR PARSER):
====================================================
1. OUTPUT RAW JSON ONLY. Do NOT write any conversational text before or after the JSON (e.g. no "Here is your quiz:", no notes, no commentary).
2. DO NOT USE UNESCAPED DOUBLE QUOTES inside questions, options, or explanations. If you need quotes inside text, use single quotes (e.g. 'like this') or escape them (\\"like this\\").
3. DO NOT INCLUDE TRAILING COMMAS after the last item in arrays or objects.
4. NO COMMENTS. Do not include // or /* */ comments inside the JSON.
5. NO RAW LINE BREAKS inside string values. Keep each string on a single line.
6. DATA TYPES:
   - "correctIndex" MUST be an integer: 0, 1, 2, or 3 (NOT a string, NOT a letter like "A").
   - "isImportant" MUST be a boolean: true or false (NOT a string "true").
   - "options" MUST be an array of exactly 4 strings.
   - "id" MUST be a unique string (e.g. "q_1", "q_2", ...).

JSON SCHEMA TO PRODUCE:
{
  "title": "A short, descriptive title based on the presentation topic",
  "questions": [
    {
      "id": "q_1",
      "question": "Insert question text here (use single quotes 'term' for inner quotes)",
      "options": [
        "First choice",
        "Second choice",
        "Third choice",
        "Fourth choice"
      ],
      "correctIndex": 0,
      "isImportant": true,
      "explanation": "Explain why this answer is correct based on the presentation."
    }
  ]
}`;

// PDF AI Prompt
const PDF_AI_PROMPT_TEXT = `You are a precision data extraction assistant. Your task is to process a multiple-choice quiz document (including its trailing answer key) and convert the content into a single, perfectly valid JSON object.

### INSTRUCTIONS:
1. Parse every question and its 4 options (A, B, C, D).
2. Cross-reference each question with the answer key provided at the end of the document.
3. Convert answer letters to zero-based integer indices: A = 0, B = 1, C = 2, D = 3.
4. Synthesize a concise, 1-2 sentence explanation clarifying why the correct answer is right.
5. Set "isImportant" to true for foundational, high-yield, or key concepts, and false for niche facts.
6. Strictly enforce all syntax constraints below.

### STRICT SYNTAX & FORMATTING RULES:
1. OUTPUT RAW JSON ONLY: Do not write any conversational text, notes, markdown intro text, or post-processing commentary. Start your response with { and end with }.
2. INNER QUOTES: Never use unescaped double quotes inside strings. Convert all internal double quotes to single quotes (e.g., write 'term' instead of "term").
3. NO TRAILING COMMAS: Ensure there are no trailing commas after the final element in any array or object.
4. NO COMMENTS: Do not include // or /* */ comments inside the JSON output.
5. SINGLE-LINE STRINGS: Do not put raw line breaks inside string values. Keep each string on one continuous line.
6. DATA TYPE INTEGRITY:
   - "id": String (e.g., "q_1", "q_2")
   - "question": String
   - "options": Array containing EXACTLY 4 Strings
   - "correctIndex": Integer (0, 1, 2, or 3 only — NOT string "0" or letter "A")
   - "isImportant": Boolean (literal true or false — NOT string "true")
   - "explanation": String

### EXPECTED JSON SCHEMA:
{
  "title": "A short, descriptive title based on the document content",
  "questions": [
    {
      "id": "q_1",
      "question": "Question text here (use single quotes 'like this' for inner text)",
      "options": [
        "First option",
        "Second option",
        "Third option",
        "Fourth option"
      ],
      "correctIndex": 0,
      "isImportant": true,
      "explanation": "Concise, factual explanation supporting the correct answer index."
    }
  ]
}
`;

export default function QuizApp() {
  const [gameState, setGameState] = useState(() => {
    // Clear any legacy localStorage value
    localStorage.removeItem('isLoggedIn');
    return sessionStorage.getItem('isLoggedIn') === 'true' ? 'home' : 'login';
  });

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copiedPptx, setCopiedPptx] = useState(false);
  const [copiedPdf, setCopiedPdf] = useState(false);

  // Login state
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginShake, setLoginShake] = useState(false);

  // Create Class Modal state
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // Test Generator Config state
  const [testTotalQuestions, setTestTotalQuestions] = useState(40);
  const [testQuizCounts, setTestQuizCounts] = useState({});
  const [testTitle, setTestTitle] = useState('');

  const navigateTo = (nextGameState, nextClass = selectedClass, nextQuiz = null) => {
    setGameState(nextGameState);
    setSelectedClass(nextClass);
    if (nextQuiz !== undefined) {
      setCurrentQuiz(nextQuiz);
    }
    setError('');
    setShowExplanation(false);
    window.history.pushState({
      gameState: nextGameState,
      selectedClass: nextClass,
      currentQuiz: nextQuiz
    }, '');
  };

  const goBack = (fallbackGameState = 'home', fallbackClass = null) => {
    if (window.history.state && window.history.length > 1) {
      window.history.back();
    } else {
      setSelectedClass(fallbackClass);
      setGameState(fallbackGameState);
      setCurrentQuiz(null);
      setShowExplanation(false);
      setError('');
      window.history.replaceState({
        gameState: fallbackGameState,
        selectedClass: fallbackClass,
        currentQuiz: null
      }, '');
      if (fallbackGameState === 'home' || fallbackGameState === 'class') {
        fetchQuizzes();
      }
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchQuizzes();

    // Initialize browser history entry if not already set
    const isLogged = sessionStorage.getItem('isLoggedIn') === 'true';
    const initialGameState = isLogged ? 'home' : 'login';
    window.history.replaceState({
      gameState: initialGameState,
      selectedClass: null,
      currentQuiz: null
    }, '');

    const handlePopState = (e) => {
      const state = e.state;
      if (state && state.gameState) {
        setGameState(state.gameState);
        setSelectedClass(state.selectedClass || null);
        if (state.currentQuiz) {
          setCurrentQuiz(state.currentQuiz);
          setUserAnswers(state.currentQuiz.userAnswers || {});
          setCurrentIndex(0);
        } else {
          setCurrentQuiz(null);
        }
        setShowExplanation(false);
        setError('');
        if (state.gameState === 'home' || state.gameState === 'class') {
          fetchQuizzes();
        }
      } else {
        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        setGameState(loggedIn ? 'home' : 'login');
        setSelectedClass(null);
        setCurrentQuiz(null);
        setShowExplanation(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/classes`);
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (err) {
      console.error('Could not load classes:', err);
    }
  };

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

  const handleCopyPptxPrompt = () => {
    navigator.clipboard.writeText(PPTX_AI_PROMPT_TEXT).then(() => {
      setCopiedPptx(true);
      setTimeout(() => setCopiedPptx(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy to clipboard.');
    });
  };

  const handleCopyPdfPrompt = () => {
    navigator.clipboard.writeText(PDF_AI_PROMPT_TEXT).then(() => {
      setCopiedPdf(true);
      setTimeout(() => setCopiedPdf(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy to clipboard.');
    });
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/classes`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ name: newClassName.trim() })
      });

      if (!res.ok) throw new Error('Failed to create class');
      const savedClass = await res.json();
      setClasses([savedClass, ...classes]);
      setNewClassName('');
      setShowClassModal(false);
    } catch (err) {
      setError('Failed to create class. Please try again.');
    }
  };

  const handleDeleteClass = async (e, classId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this class? This will delete ALL quizzes and tests inside it!")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
        method: 'DELETE',
        headers: API_HEADERS
      });

      if (!res.ok) throw new Error('Failed to delete class');

      setClasses(classes.filter(c => c._id !== classId));
      setQuizzes(quizzes.filter(q => q.classId !== classId));
      if (selectedClass && selectedClass._id === classId) {
        setSelectedClass(null);
        setGameState('home');
        window.history.replaceState({
          gameState: 'home',
          selectedClass: null,
          currentQuiz: null
        }, '');
      }
    } catch (err) {
      setError('Failed to delete class.');
    }
  };

  const handleSaveNewQuiz = async () => {
    setSaving(true);
    setError('');

    if (!inputText.trim()) {
      setError('Please paste the AI output JSON into the text box.');
      setSaving(false);
      return;
    }

    let parsedData;
    try {
      let text = inputText.trim();
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');

      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        throw new Error('No JSON object found. Please make sure the output starts with "{" and ends with "}".');
      }

      let jsonString = text.substring(firstBrace, lastBrace + 1);

      // Clean up common AI json quirks: comments & trailing commas
      const cleanJsonString = jsonString
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove multi-line comments
        .replace(/\/\/.*/g, '')            // remove single-line comments
        .replace(/,\s*}/g, '}')           // remove trailing commas in objects
        .replace(/,\s*]/g, ']');          // remove trailing commas in arrays

      try {
        parsedData = JSON.parse(jsonString);
      } catch {
        parsedData = JSON.parse(cleanJsonString);
      }

      if (!parsedData.title || !Array.isArray(parsedData.questions)) {
        throw new Error('JSON is missing required "title" or "questions" array.');
      }

      // Normalize question data
      parsedData.questions = parsedData.questions.map((q, idx) => {
        let correctIdx = q.correctIndex;
        if (typeof correctIdx === 'string') {
          const map = { a: 0, b: 1, c: 2, d: 3 };
          correctIdx = map[correctIdx.toLowerCase()] !== undefined ? map[correctIdx.toLowerCase()] : parseInt(correctIdx, 10);
        }
        if (isNaN(correctIdx) || correctIdx === undefined) correctIdx = 0;

        return {
          ...q,
          id: q.id || `q_${idx + 1}`,
          correctIndex: correctIdx,
          isImportant: q.isImportant === true || q.isImportant === 'true',
          options: Array.isArray(q.options) ? q.options : []
        };
      });
    } catch (parseErr) {
      console.error('JSON parsing failed:', parseErr);
      setError(`Invalid JSON format: ${parseErr.message}`);
      setSaving(false);
      return;
    }

    try {
      parsedData.userAnswers = {};
      parsedData.classId = selectedClass && selectedClass._id !== 'uncategorized' ? selectedClass._id : null;
      parsedData.isTest = false;

      const res = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(parsedData)
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`Server returned status ${res.status}: ${errBody || res.statusText}`);
      }

      const savedQuiz = await res.json();
      setQuizzes([savedQuiz, ...quizzes]);
      setInputText('');

      // Start the quiz directly
      startQuiz(savedQuiz);
    } catch (apiErr) {
      console.error('API call failed:', apiErr);
      setError(`Failed to save quiz to server: ${apiErr.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuiz = async (e, id) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this? This cannot be undone.")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'DELETE',
        headers: API_HEADERS
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      
      setQuizzes(quizzes.filter(quiz => quiz._id !== id));
    } catch (err) {
      setError("Failed to delete. Ensure backend is running.");
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
    const shuffledQuestions = shuffleArray(quiz.questions || []);
    const quizWithShuffled = { ...quiz, questions: shuffledQuestions };
    setCurrentQuiz(quizWithShuffled);
    setUserAnswers(quiz.userAnswers || {});
    setCurrentIndex(0);
    setShowExplanation(false);
    setGameState('quiz');
    window.history.pushState({
      gameState: 'quiz',
      selectedClass: selectedClass,
      currentQuiz: quizWithShuffled
    }, '');
  };

  const handleChoiceClick = (optionIndex) => {
    const qId = currentQuiz.questions[currentIndex].id;
    if (userAnswers[qId] !== undefined) return; 
    
    const updatedAnswers = { ...userAnswers, [qId]: optionIndex };
    setUserAnswers(updatedAnswers);
    if (currentQuiz._id) {
      saveProgressToDB(currentQuiz._id, updatedAnswers);
    }
  };

  const handleResetQuiz = () => {
    if (window.confirm("Are you sure you want to clear your previous answers and retake this?")) {
      setUserAnswers({});
      if (currentQuiz._id) {
        saveProgressToDB(currentQuiz._id, {});
      }
      setCurrentIndex(0);
      setShowExplanation(false);
    }
  };

  // --- Test Generation Helpers ---
  const openTestConfig = () => {
    const classQuizzes = quizzes.filter(q => 
      (selectedClass._id === 'uncategorized' ? !q.classId : q.classId === selectedClass._id) && !q.isTest
    );

    if (classQuizzes.length === 0) {
      setError('Please add at least one quiz to this class before generating a test.');
      return;
    }

    const totalAvailable = classQuizzes.reduce((sum, q) => sum + (q.questions ? q.questions.length : 0), 0);
    const targetTotal = Math.min(40, totalAvailable);
    setTestTotalQuestions(targetTotal);
    setTestTitle(`${selectedClass.name} - Test (${targetTotal} Questions)`);

    // Calculate even split
    calculateEvenSplit(classQuizzes, targetTotal);
    navigateTo('testConfig', selectedClass, null);
  };

  const calculateEvenSplit = (classQuizzes, targetTotal) => {
    const numQuizzes = classQuizzes.length;
    if (numQuizzes === 0) return;

    let remaining = targetTotal;
    const counts = {};

    // Initial base count per quiz
    const baseShare = Math.floor(targetTotal / numQuizzes);
    let extra = targetTotal % numQuizzes;

    classQuizzes.forEach((q, idx) => {
      const available = q.questions ? q.questions.length : 0;
      let count = baseShare + (idx < extra ? 1 : 0);
      counts[q._id] = Math.min(count, available);
      remaining -= counts[q._id];
    });

    // If some quizzes had fewer than their share, distribute leftovers to quizzes that have more
    if (remaining > 0) {
      for (let q of classQuizzes) {
        if (remaining <= 0) break;
        const available = q.questions ? q.questions.length : 0;
        const currentCount = counts[q._id] || 0;
        const canAdd = available - currentCount;
        if (canAdd > 0) {
          const add = Math.min(canAdd, remaining);
          counts[q._id] += add;
          remaining -= add;
        }
      }
    }

    setTestQuizCounts(counts);
  };

  const handleTotalQuestionsChange = (val) => {
    const newTotal = Math.max(1, parseInt(val, 10) || 1);
    setTestTotalQuestions(newTotal);
    
    const classQuizzes = quizzes.filter(q => 
      (selectedClass._id === 'uncategorized' ? !q.classId : q.classId === selectedClass._id) && !q.isTest
    );
    calculateEvenSplit(classQuizzes, newTotal);
    setTestTitle(`${selectedClass.name} - Test (${newTotal} Questions)`);
  };

  const handleQuizCountChange = (quizId, val) => {
    const count = Math.max(0, parseInt(val, 10) || 0);
    const updated = { ...testQuizCounts, [quizId]: count };
    setTestQuizCounts(updated);
    
    const sum = Object.values(updated).reduce((a, b) => a + b, 0);
    setTestTotalQuestions(sum);
    setTestTitle(`${selectedClass.name} - Test (${sum} Questions)`);
  };

  const handleGenerateAndSaveTest = async () => {
    setSaving(true);
    setError('');

    const classQuizzes = quizzes.filter(q => 
      (selectedClass._id === 'uncategorized' ? !q.classId : q.classId === selectedClass._id) && !q.isTest
    );

    let testQuestions = [];

    classQuizzes.forEach(q => {
      const takeCount = testQuizCounts[q._id] || 0;
      if (takeCount > 0 && q.questions && q.questions.length > 0) {
        const shuffledPool = shuffleArray(q.questions);
        const selected = shuffledPool.slice(0, takeCount).map((question, idx) => ({
          ...question,
          id: `${q._id}_${question.id || idx}`
        }));
        testQuestions.push(...selected);
      }
    });

    if (testQuestions.length === 0) {
      setError('Please select at least 1 question for the test.');
      setSaving(false);
      return;
    }

    const compiledTest = {
      title: testTitle.trim() || `${selectedClass.name} Test`,
      classId: selectedClass._id !== 'uncategorized' ? selectedClass._id : null,
      isTest: true,
      questions: shuffleArray(testQuestions),
      userAnswers: {}
    };

    try {
      const res = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(compiledTest)
      });

      if (!res.ok) throw new Error('Failed to save test');
      const savedTest = await res.json();
      setQuizzes([savedTest, ...quizzes]);
      startQuiz(savedTest);
    } catch (err) {
      console.error('Failed to create test:', err);
      setError('Failed to save test. Running as temporary test.');
      startQuiz(compiledTest);
    } finally {
      setSaving(false);
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

  // --- Login Handler ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPassword.trim().toLowerCase() === 'eimo') {
      sessionStorage.setItem('isLoggedIn', 'true');
      setGameState('home');
      setLoginError(false);
      setLoginPassword('');
      window.history.replaceState({
        gameState: 'home',
        selectedClass: null,
        currentQuiz: null
      }, '');
    } else {
      setLoginError(true);
      setLoginShake(true);
      setLoginPassword('');
      setTimeout(() => setLoginShake(false), 500);
    }
  };

  // ==========================================
  // 1. LOGIN SCREEN
  // ==========================================
  if (gameState === 'login') {
    return (
      <div style={styles.loginContainer}>
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

  // ==========================================
  // 2. HOME SCREEN: MY CLASSES
  // ==========================================
  if (gameState === 'home') {
    const uncategorizedQuizzes = quizzes.filter(q => !q.classId);
    
    return (
      <div style={styles.page}>
        <h1 style={styles.header}>My Classes</h1>
        <p style={styles.subHeader}>Select a class to view its quizzes and tests</p>
        
        {error && <div style={styles.errorMsg}>{error}</div>}
        
        {loading ? (
          <p style={{marginBottom: '2rem', fontSize: '1.2rem'}}>Connecting to database... (Render servers may take 30s to wake up)</p>
        ) : (
          <div style={styles.grid}>
            {classes.map((cls) => {
              const classQuizzes = quizzes.filter(q => q.classId === cls._id && !q.isTest);
              const classTests = quizzes.filter(q => q.classId === cls._id && q.isTest);
              return (
                <div 
                  key={cls._id} 
                  style={styles.cardSquare} 
                  onClick={() => navigateTo('class', cls, null)}
                >
                  <button 
                    style={styles.deleteBtn} 
                    onClick={(e) => handleDeleteClass(e, cls._id)}
                    title="Delete Class"
                  >
                    ✕
                  </button>
                  <span style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🏫 {cls.name}</span>
                  <div style={styles.cardSubtext}>
                    {classQuizzes.length} {classQuizzes.length === 1 ? 'Quiz' : 'Quizzes'} • {classTests.length} {classTests.length === 1 ? 'Test' : 'Tests'}
                  </div>
                </div>
              );
            })}

            {/* If there are existing legacy quizzes without classId, show Uncategorized class */}
            {uncategorizedQuizzes.length > 0 && (
              <div 
                style={{ ...styles.cardSquare, backgroundColor: '#f5f5f5' }} 
                onClick={() => navigateTo('class', { _id: 'uncategorized', name: 'Uncategorized' }, null)}
              >
                <span style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>📁 Uncategorized</span>
                <div style={styles.cardSubtext}>
                  {uncategorizedQuizzes.filter(q => !q.isTest).length} Quizzes • {uncategorizedQuizzes.filter(q => q.isTest).length} Tests
                </div>
              </div>
            )}
          </div>
        )}

        <button style={styles.btnPrimary} onClick={() => setShowClassModal(true)}>
          + Create New Class
        </button>

        {/* Modal: Create Class */}
        {showClassModal && (
          <div style={styles.modalOverlay} onClick={() => setShowClassModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ margin: 0, fontSize: '1.6rem' }}>Create New Class</h2>
              <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="e.g. Biology 101, Anatomy, History"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  style={styles.textInput}
                  autoFocus
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button 
                    type="button" 
                    style={styles.controlBtn} 
                    onClick={() => setShowClassModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={styles.btnPrimary}>
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 3. CLASS DETAIL SCREEN (QUIZZES & TESTS)
  // ==========================================
  if (gameState === 'class') {
    const classQuizzes = quizzes.filter(q => 
      (selectedClass._id === 'uncategorized' ? !q.classId : q.classId === selectedClass._id) && !q.isTest
    );
    const classTests = quizzes.filter(q => 
      (selectedClass._id === 'uncategorized' ? !q.classId : q.classId === selectedClass._id) && q.isTest
    );

    return (
      <div style={styles.page}>
        <div style={{ ...styles.controls, marginTop: 0, marginBottom: '1.5rem', width: '100%', maxWidth: '1000px' }}>
          <button style={styles.controlBtn} onClick={() => goBack('home', null)}>
            ◄ Back to Classes
          </button>
          {selectedClass._id !== 'uncategorized' && (
            <button style={styles.btnWarning} onClick={(e) => handleDeleteClass(e, selectedClass._id)}>
              🗑️ Delete Class
            </button>
          )}
        </div>

        <h1 style={{ ...styles.header, marginBottom: '0.5rem' }}>🏫 {selectedClass.name}</h1>
        <p style={styles.subHeader}>Manage quizzes and practice comprehensive tests</p>

        {error && <div style={styles.errorMsg}>{error}</div>}

        {/* --- SECTION 1: QUIZZES --- */}
        <div style={styles.sectionTitle}>
          <span>📚 Quizzes ({classQuizzes.length})</span>
          <button 
            style={{ ...styles.btnPrimary, padding: '0.6rem 1.4rem', fontSize: '0.95rem' }} 
            onClick={() => navigateTo('create', selectedClass, null)}
          >
            + Add Quiz
          </button>
        </div>

        {classQuizzes.length === 0 ? (
          <p style={{ margin: '1.5rem 0 2.5rem 0', opacity: 0.8, fontSize: '1.1rem' }}>
            No quizzes in this class yet. Click "+ Add Quiz" to create one!
          </p>
        ) : (
          <div style={styles.grid}>
            {classQuizzes.map((quiz) => {
              const qCount = quiz.questions ? quiz.questions.length : 0;
              const answeredCount = quiz.userAnswers ? Object.keys(quiz.userAnswers).length : 0;
              return (
                <div key={quiz._id} style={styles.cardSquare} onClick={() => startQuiz(quiz)}>
                  <button 
                    style={styles.deleteBtn} 
                    onClick={(e) => handleDeleteQuiz(e, quiz._id)}
                    title="Delete Quiz"
                  >
                    ✕
                  </button>
                  <span style={{ fontSize: '1.25rem' }}>{quiz.title}</span>
                  <div style={styles.cardSubtext}>
                    {qCount} Questions {answeredCount > 0 ? `• (${answeredCount}/${qCount} answered)` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- SECTION 2: TESTS --- */}
        <div style={{ ...styles.sectionTitle, marginTop: '2.5rem' }}>
          <span>📝 Tests ({classTests.length})</span>
          <button 
            style={{ ...styles.btnYellow, padding: '0.6rem 1.4rem', fontSize: '0.95rem' }} 
            onClick={openTestConfig}
          >
            ⚡ Create Test
          </button>
        </div>

        {classTests.length === 0 ? (
          <p style={{ margin: '1.5rem 0', opacity: 0.8, fontSize: '1.1rem' }}>
            No tests created yet. Click "⚡ Create Test" to generate a randomized test across all quizzes!
          </p>
        ) : (
          <div style={styles.grid}>
            {classTests.map((test) => {
              const qCount = test.questions ? test.questions.length : 0;
              const answeredCount = test.userAnswers ? Object.keys(test.userAnswers).length : 0;
              return (
                <div key={test._id} style={styles.testCardSquare} onClick={() => startQuiz(test)}>
                  <button 
                    style={styles.deleteBtn} 
                    onClick={(e) => handleDeleteQuiz(e, test._id)}
                    title="Delete Test"
                  >
                    ✕
                  </button>
                  <span style={{ fontSize: '1.25rem' }}>⭐ {test.title}</span>
                  <div style={styles.cardSubtext}>
                    {qCount} Questions {answeredCount > 0 ? `• (${answeredCount}/${qCount} answered)` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 4. TEST CONFIGURATION SCREEN
  // ==========================================
  if (gameState === 'testConfig') {
    const classQuizzes = quizzes.filter(q => 
      (selectedClass._id === 'uncategorized' ? !q.classId : q.classId === selectedClass._id) && !q.isTest
    );
    const totalSelected = Object.values(testQuizCounts).reduce((a, b) => a + b, 0);

    return (
      <div style={styles.page}>
        <h1 style={styles.header}>⚡ Create Test for {selectedClass.name}</h1>
        <p style={styles.subHeader}>Configure the question split across quizzes in this class</p>

        {error && <div style={styles.errorMsg}>{error}</div>}

        <div style={styles.configCard}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>Test Title</label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              style={styles.textInput}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>Total Questions on Test</label>
              <input
                type="number"
                min="1"
                value={testTotalQuestions}
                onChange={(e) => handleTotalQuestionsChange(e.target.value)}
                style={styles.numberInput}
              />
            </div>

            <button 
              style={{ ...styles.btnSecondary, padding: '0.6rem 1.2rem', fontSize: '0.95rem' }}
              onClick={() => calculateEvenSplit(classQuizzes, testTotalQuestions)}
            >
              🔄 Recalculate Even Split
            </button>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.8rem', borderBottom: '1px solid #ddd', paddingBottom: '0.4rem' }}>
              Questions Per Quiz (Even Split by Default):
            </label>
            {classQuizzes.map(q => {
              const available = q.questions ? q.questions.length : 0;
              const count = testQuizCounts[q._id] !== undefined ? testQuizCounts[q._id] : 0;
              return (
                <div key={q._id} style={styles.quizConfigRow}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{q.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{available} total available questions</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      min="0"
                      max={available}
                      value={count}
                      onChange={(e) => handleQuizCountChange(q._id, e.target.value)}
                      style={styles.numberInput}
                    />
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>/ {available}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'right', color: colors.dark }}>
            Total Configured Questions: <span style={{ color: colors.green }}>{totalSelected}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '750px', justifyContent: 'flex-end' }}>
          <button style={styles.controlBtn} onClick={() => goBack('class', selectedClass)} disabled={saving}>
            Cancel
          </button>
          <button style={styles.btnPrimary} onClick={handleGenerateAndSaveTest} disabled={saving || totalSelected === 0}>
            {saving ? 'Generating Test...' : '⚡ Start Test'}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. CREATE QUIZ SCREEN (PPTX & PDF PROMPT BUTTONS)
  // ==========================================
  if (gameState === 'create') {
    return (
      <div style={styles.page}>
        <h1 style={styles.header}>Paste AI Output</h1>
        <p style={styles.subHeader}>
          Adding quiz to: <strong>{selectedClass ? selectedClass.name : 'Class'}</strong>
        </p>

        {error && <div style={styles.errorMsg}>{error}</div>}
        
        {/* Dual AI Prompt Copy Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            style={{
              ...styles.copyBtn,
              backgroundColor: copiedPptx ? colors.correctGreen : colors.blue,
              boxShadow: copiedPptx ? '0 4px 0 #4a8c29' : '0 4px 0 #0d468a'
            }} 
            onClick={handleCopyPptxPrompt}
          >
            {copiedPptx ? '✅ Copied!' : '📋 pptx AI prompt'}
          </button>

          <button 
            style={{
              ...styles.copyBtn,
              backgroundColor: copiedPdf ? colors.correctGreen : colors.yellow,
              color: copiedPdf ? colors.white : colors.dark,
              boxShadow: copiedPdf ? '0 4px 0 #4a8c29' : '0 4px 0 #cc9a06'
            }} 
            onClick={handleCopyPdfPrompt}
          >
            {copiedPdf ? '✅ Copied!' : '📄 pdf AI prompt'}
          </button>
        </div>

        <textarea
          style={styles.inputArea}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='{ "title": "...", "questions": [...] }'
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={styles.controlBtn} onClick={() => goBack(selectedClass ? 'class' : 'home', selectedClass)} disabled={saving}>
            Cancel
          </button>
          <button style={styles.btnPrimary} onClick={handleSaveNewQuiz} disabled={saving}>
            {saving ? 'Saving to Database...' : 'Save & Start'}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 6. QUIZ & TEST TAKING SCREEN
  // ==========================================
  const currentQ = currentQuiz?.questions ? currentQuiz.questions[currentIndex] : null;
  const qId = currentQ?.id;
  const hasAnswered = currentQ ? userAnswers[qId] !== undefined : false;

  // Compute progress bar data
  const totalQuestions = currentQuiz?.questions ? currentQuiz.questions.length : 0;
  const correctCount = currentQuiz?.questions ? currentQuiz.questions.filter(q => {
    const answer = userAnswers[q.id];
    return answer !== undefined && answer === q.correctIndex;
  }).length : 0;

  if (!currentQ) {
    return (
      <div style={styles.page}>
        <p>No questions found in this quiz.</p>
        <button style={styles.controlBtn} onClick={() => goBack(selectedClass ? 'class' : 'home', selectedClass)}>
          ◄ Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={{ ...styles.controls, marginTop: 0, marginBottom: '1.5rem' }}>
        <button style={styles.controlBtn} onClick={() => goBack(selectedClass ? 'class' : 'home', selectedClass)}>
          ◄ Back to {selectedClass ? selectedClass.name : 'Home'}
        </button>
        <button style={styles.btnWarning} onClick={handleResetQuiz}>
          ↻ Reset
        </button>
      </div>

      {/* Progress Bar + Score */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          {currentQuiz.questions.map((q, i) => {
            const answer = userAnswers[q.id];
            let segColor = colors.darkGray; // unanswered
            if (answer !== undefined) {
              segColor = answer === q.correctIndex ? colors.correctGreen : colors.incorrectRed;
            }
            return (
              <div
                key={q.id || i}
                onClick={() => {
                  setCurrentIndex(i);
                  setShowExplanation(false);
                }}
                title={`Question ${i + 1}${answer !== undefined ? (answer === q.correctIndex ? ' (Correct)' : ' (Incorrect)') : ''}`}
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
          style={{ ...styles.controlBtn, opacity: currentIndex === 0 ? 0.3 : 1 }} 
          onClick={() => { setCurrentIndex(currentIndex - 1); setShowExplanation(false); }}
          disabled={currentIndex === 0}
        >
          ◄ Back
        </button>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <button 
          style={{ ...styles.controlBtn, opacity: currentIndex === totalQuestions - 1 ? 0.3 : 1 }} 
          onClick={() => { setCurrentIndex(currentIndex + 1); setShowExplanation(false); }}
          disabled={currentIndex === totalQuestions - 1}
        >
          Next ►
        </button>
      </div>
    </div>
  );
}