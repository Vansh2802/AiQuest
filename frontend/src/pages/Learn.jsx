import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const DIFFICULTY_COLORS = {
  Beginner: 'text-retro-green border-retro-green/40',
  Intermediate: 'text-retro-yellow border-retro-yellow/40',
  Advanced: 'text-retro-red border-retro-red/40',
};

export default function Learn() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/user/topics');
        if (res.data.ok) setTopics(res.data.topics);
      } catch {
        /* handled by interceptor */
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-retro-yellow text-sm animate-pixel-blink">LOADING TOPICS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-darker via-retro-dark to-retro-purple pt-20 px-4 pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-pixel text-retro-yellow text-2xl mb-2">📚 LEARNING PATH</h1>
          <p className="font-pixel text-xs text-gray-600 dark:text-gray-400">
            CHOOSE A TOPIC TO START YOUR QUEST
          </p>
        </motion.div>

        {/* Topic Grid */}
        {topics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((t, i) => {
              const diffClass = DIFFICULTY_COLORS[t.difficulty] || DIFFICULTY_COLORS.Beginner;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to={`/study?topic=${encodeURIComponent(t.title)}`}>
                    <motion.div
                      className={`retro-panel p-6 h-full flex flex-col cursor-pointer transition-all ${
                        t.completed ? 'opacity-60' : ''
                      }`}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Completed badge */}
                      {t.completed && (
                        <div className="absolute top-2 right-3">
                          <span className="font-pixel text-xs text-retro-green">✅ DONE</span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="font-pixel text-sm text-gray-900 dark:text-white mb-2">{t.title}</h3>

                      {/* Difficulty badge */}
                      <span
                        className={`font-pixel text-xs border px-2 py-1 inline-block mb-3 w-fit ${diffClass}`}
                      >
                        {t.difficulty.toUpperCase()}
                      </span>

                      {/* Description */}
                      <p className="font-pixel text-xs text-gray-600 dark:text-gray-400 leading-5 flex-1 mb-4">
                        {t.description}
                      </p>

                      {/* Category */}
                      <p className="font-pixel text-xs text-gray-500 dark:text-gray-600 mb-3">{t.category}</p>

                      {/* CTA */}
                      <div className="mt-auto">
                        <span className="retro-btn bg-retro-cyan text-retro-dark border-cyan-600 text-xs inline-block">
                          {t.completed ? '🔄 REVIEW' : '▶ START LEARNING'}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="retro-panel p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-pixel text-sm text-gray-600 dark:text-gray-400 mb-4">NO TOPICS AVAILABLE</p>
            <p className="font-pixel text-xs text-gray-600 dark:text-gray-500 mb-6">
              Set your interests first to see personalized topics!
            </p>
            <Link to="/interests">
              <motion.button
                className="retro-btn bg-retro-yellow text-retro-dark border-yellow-600 text-xs"
                whileHover={{ scale: 1.05 }}
              >
                🎯 SET INTERESTS
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Back to Dashboard */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/dashboard">
            <span className="font-pixel text-xs text-gray-600 dark:text-gray-500 hover:text-retro-cyan transition-colors">
              ← BACK TO DASHBOARD
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
