import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import ExplanationPanel from '../components/ExplanationPanel';
import QuizPanel from '../components/QuizPanel';
import { playLevelUp, playCorrect, playClick, playXP, playWrong } from '../utils/sounds';

const YOUTUBE_VIDEOS = {
  'Binary Search': 'TbbSJrY5GqQ',
  'Recursion': '9OsMG4fI4OY',
  'JavaScript Closures': 'Ze-JGb4I9zU',
  'Python Lists': 'eF6nK5bSlmg',
  'Sorting Algorithms': '1jCFUv-Xlqo',
  'Web Development': 'tVzUXW6siu0',
};

export default function Study() {
  const { topic: urlTopic } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryTopic = searchParams.get('topic') || '';
  const decodedUrlTopic = decodeURIComponent(urlTopic || '') || queryTopic;

  const [customInput, setCustomInput] = useState('');
  const [topic, setTopic] = useState(decodedUrlTopic);
  const [explanation, setExplanation] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [levelUp, setLevelUp] = useState(false);
  const [step, setStep] = useState('input'); // input -> explanation -> quiz -> done
  const [nextTopic, setNextTopic] = useState(null);
  const [userTopics, setUserTopics] = useState([]);

  // Sync topic when URL changes (path param or query param)
  useEffect(() => {
    const decoded = decodeURIComponent(urlTopic || '') || searchParams.get('topic') || '';
    if (decoded) {
      setTopic(decoded);
      setExplanation('');
      setQuiz(null);
      setQuizResult(null);
      setStep('explanation'); // auto-advance to explanation
    }
  }, [urlTopic, searchParams]);

  // Auto-fetch explanation when step becomes 'explanation' and topic is set
  useEffect(() => {
    if (step === 'explanation' && topic && !explanation && !loadingExplain) {
      handleExplain();
    }
  }, [step, topic]);

  const handleLearnTopic = () => {
    const t = customInput.trim();
    if (!t) return;
    playClick();
    navigate(`/study?topic=${encodeURIComponent(t)}`);
  };

  // Load next topic for "Next Topic" button + topics list for input view
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/user/topics');
        if (res.data.ok) {
          setUserTopics(res.data.topics);
          const incomplete = res.data.topics.filter(
            (t) => !t.completed && t.title !== topic
          );
          if (incomplete.length > 0) setNextTopic(incomplete[0]);
        }
      } catch {
        /* ignore */
      }
    };
    fetchTopics();
  }, [topic]);

  const handleExplain = async () => {
    if (!topic.trim()) return;
    setLoadingExplain(true);
    setExplanation('');
    try {
      const res = await api.post('/ai/explain', { topic });
      if (res.data.ok === false) {
        setExplanation(res.data.message || 'Failed to get explanation.');
      } else {
        setExplanation(res.data.explanation);
      }
    } catch {
      setExplanation('Failed to get explanation. Please try again.');
    } finally {
      setLoadingExplain(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return;
    setLoadingQuiz(true);
    setQuiz(null);
    setQuizResult(null);
    try {
      const res = await api.post('/ai/quiz', { topic });
      if (res.data.ok === false) {
        setQuiz(null);
      } else {
        setQuiz(res.data.questions);
      }
    } catch {
      setQuiz(null);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleQuizSubmit = async (answers) => {
    if (!quiz) return;
    let score = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    try {
      const res = await api.post('/user/submit-quiz', {
        topic,
        score,
        total: quiz.length,
      });
      setQuizResult({
        score,
        total: quiz.length,
        xp_earned: res.data.xp_earned,
        total_xp: res.data.total_xp,
        level: res.data.level,
      });
      if (res.data.leveled_up) {
        setLevelUp(true);
        playLevelUp();
        setTimeout(() => setLevelUp(false), 4000);
      } else {
        playXP();
      }
      setStep('done');
    } catch {
      setQuizResult({ score, total: quiz.length, xp_earned: score * 10 });
      setStep('done');
    }
  };

  const videoId = YOUTUBE_VIDEOS[topic];

  const continueLearning = userTopics.filter((t) => !t.completed).slice(0, 3);
  const recommendedTopics = userTopics.filter((t) => !t.completed).slice(0, 4);

  if (!topic || step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-retro-darker via-retro-dark to-retro-purple pt-20 px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-pixel text-retro-yellow text-2xl mb-2">📖 STUDY ROOM</h1>
            <p className="font-pixel text-xs text-gray-600 dark:text-gray-400">ENTER ANY TOPIC TO START LEARNING</p>
          </motion.div>

          {/* Topic Input */}
          <motion.div className="retro-panel p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className="font-pixel text-xs text-retro-cyan block mb-3">🎯 WHAT DO YOU WANT TO LEARN TODAY?</label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLearnTopic()}
              className="retro-input mb-4"
              placeholder="e.g. Binary Search, React Hooks, Machine Learning..."
            />
            <motion.button
              onClick={handleLearnTopic}
              className="retro-btn bg-retro-yellow text-retro-dark border-yellow-600 text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!customInput.trim()}
            >
              📚 LEARN TOPIC
            </motion.button>
          </motion.div>

          {/* Continue Learning */}
          {continueLearning.length > 0 && (
            <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="font-pixel text-sm text-retro-cyan mb-3">🔄 CONTINUE LEARNING</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {continueLearning.map((t) => (
                  <motion.div
                    key={t.title}
                    className="retro-panel p-4 cursor-pointer hover:border-retro-cyan transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { playClick(); navigate(`/study?topic=${encodeURIComponent(t.title)}`); }}
                  >
                    <p className="font-pixel text-xs text-retro-yellow mb-1">{t.title.toUpperCase()}</p>
                    <p className="font-pixel text-[10px] text-gray-600 dark:text-gray-400">{t.difficulty || 'Beginner'}</p>
                    {t.xp > 0 && <p className="font-pixel text-[10px] text-retro-green mt-1">+{t.xp} XP earned</p>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recommended Topics */}
          {recommendedTopics.length > 0 && (
            <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h2 className="font-pixel text-sm text-retro-cyan mb-3">⭐ RECOMMENDED TOPICS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendedTopics.map((t) => (
                  <motion.div
                    key={t.title}
                    className="retro-panel p-4 cursor-pointer hover:border-retro-yellow transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { playClick(); navigate(`/study?topic=${encodeURIComponent(t.title)}`); }}
                  >
                    <p className="font-pixel text-xs text-retro-yellow mb-1">{t.title.toUpperCase()}</p>
                    <div className="flex gap-3">
                      <span className="font-pixel text-[10px] text-retro-purple">{t.difficulty || 'Beginner'}</span>
                      <span className="font-pixel text-[10px] text-gray-600 dark:text-gray-400">{t.category || 'General'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Browse All Topics Link */}
          <motion.div className="text-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <Link to="/learn">
              <span className="font-pixel text-xs text-gray-600 dark:text-gray-500 hover:text-retro-cyan transition-colors">
                📚 BROWSE ALL TOPICS →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-darker via-retro-dark to-retro-purple pt-20 px-4 pb-8">
      {/* Level Up Animation */}
      <AnimatePresence>
        {levelUp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.3 }}
              animate={{ scale: [0.3, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-pixel text-retro-yellow text-4xl mb-4">🏆</p>
              <p className="font-pixel text-retro-yellow text-2xl mb-2">LEVEL UP!</p>
              <p className="font-pixel text-retro-cyan text-sm">YOU REACHED A NEW LEVEL!</p>
              <motion.div className="mt-4 flex justify-center gap-2 text-2xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 0.5, repeat: 3 }}>
                ⭐ ⭐ ⭐
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-pixel text-retro-yellow text-2xl mb-1">📖 {topic.toUpperCase()}</h1>
          <p className="font-pixel text-xs text-gray-600 dark:text-gray-400">FOLLOW EACH STEP TO MASTER THIS TOPIC</p>
        </motion.div>

        {/* Custom Topic Input */}
        <motion.div className="flex justify-center gap-2 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLearnTopic()}
            className="bg-white/30 dark:bg-retro-darker border border-gray-300 dark:border-gray-700 font-pixel text-xs text-gray-700 dark:text-gray-300 px-3 py-2 w-64 focus:border-retro-cyan focus:outline-none"
            placeholder="Switch topic... e.g. React Hooks"
          />
          <motion.button
            onClick={handleLearnTopic}
            className="bg-retro-cyan border-2 border-cyan-400 px-3 py-2 font-pixel text-xs text-retro-dark"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!customInput.trim()}
          >
            GO
          </motion.button>
        </motion.div>

        {/* Progress Steps */}
        <motion.div className="flex justify-center gap-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {['explanation', 'quiz', 'done'].map((s, i) => {
            const labels = ['💡 LEARN', '📝 QUIZ', '✅ DONE'];
            const active = s === step;
            const completed = ['explanation', 'quiz', 'done'].indexOf(step) > i;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`font-pixel text-xs px-3 py-2 border-2 transition-all ${
                    active ? 'border-retro-yellow text-retro-yellow bg-retro-yellow/10' : completed ? 'border-retro-green text-retro-green' : 'border-gray-700 text-gray-600'
                  }`}
                >
                  {labels[i]}
                </div>
                {i < 2 && <span className={`font-pixel text-xs ${completed ? 'text-retro-green' : 'text-gray-700'}`}>→</span>}
              </div>
            );
          })}
        </motion.div>

        {/* STEP 1: AI Explanation + YouTube Video */}
        {step === 'explanation' && (
          <div>
            <ExplanationPanel explanation={explanation} loading={loadingExplain} />

            {/* YouTube Video (shown alongside explanation) */}
            {explanation && videoId && (
              <motion.div className="retro-panel p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="font-pixel text-sm text-retro-cyan mb-4">📺 WATCH & LEARN</h3>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full border-2 border-retro-cyan/30"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={topic}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}

            {/* YouTube search link if no curated video */}
            {explanation && !videoId && (
              <motion.div className="retro-panel p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="font-pixel text-sm text-retro-cyan mb-4">📺 VIDEO RESOURCES</h3>
                <div className="bg-white/30 dark:bg-retro-darker/50 border border-gray-300 dark:border-retro-cyan/20 p-6 text-center">
                  <p className="font-pixel text-xs text-gray-600 dark:text-gray-400 mb-3">NO CURATED VIDEO FOR THIS TOPIC</p>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-pixel text-xs text-retro-cyan hover:underline"
                  >
                    🔍 SEARCH ON YOUTUBE →
                  </a>
                </div>
              </motion.div>
            )}

            {/* Generate Quiz button - only shown after explanation loads */}
            {explanation && (
              <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.button
                  onClick={() => { playClick(); setStep('quiz'); handleGenerateQuiz(); }}
                  className="retro-btn bg-retro-green text-retro-dark border-green-600 text-xs"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📝 GENERATE QUIZ →
                </motion.button>
              </motion.div>
            )}
          </div>
        )}

        {/* STEP 2: Quiz */}
        {step === 'quiz' && (
          <div>
            <QuizPanel
              quiz={quiz}
              loading={loadingQuiz}
              onSubmit={handleQuizSubmit}
              result={quizResult}
              nextTopic={nextTopic}
              onNextTopic={nextTopic ? () => navigate(`/study?topic=${encodeURIComponent(nextTopic.title)}`) : undefined}
            />
          </div>
        )}

        {/* STEP 3: Completed */}
        {step === 'done' && quizResult && (
          <motion.div className="retro-panel p-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.p className="text-4xl mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
              🎉
            </motion.p>
            <p className="font-pixel text-retro-yellow text-lg mb-2">TOPIC COMPLETE!</p>
            <p className="font-pixel text-xs text-retro-green mb-1">
              SCORE: {quizResult.score}/{quizResult.total} | +{quizResult.xp_earned} XP
            </p>
            {quizResult.total_xp !== undefined && (
              <p className="font-pixel text-xs text-gray-600 dark:text-gray-400 mb-6">
                TOTAL XP: {quizResult.total_xp} | LEVEL: {quizResult.level}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {nextTopic && (
                <motion.button
                  onClick={() => navigate(`/study?topic=${encodeURIComponent(nextTopic.title)}`)}
                  className="retro-btn bg-retro-cyan text-retro-dark border-cyan-600 text-xs"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ➡ NEXT TOPIC: {nextTopic.title.toUpperCase()}
                </motion.button>
              )}
              <Link to="/learn">
                <motion.button className="retro-btn bg-retro-purple text-white border-purple-600 text-xs" whileHover={{ scale: 1.05 }}>
                  📚 ALL TOPICS
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button className="retro-btn bg-gray-700 text-gray-300 border-gray-600 text-xs" whileHover={{ scale: 1.05 }}>
                  🏠 DASHBOARD
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
