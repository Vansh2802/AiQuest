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
    <div className="min-h-screen bg-gradient-to-b from-retro-skyBlue via-retro-lightCream to-retro-grassGreen pt-20 px-4 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1 
            className="font-pixel text-retro-orangeAccent text-2xl mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📚 LEARNING PATH
          </motion.h1>
          <p className="font-pixel text-sm text-retro-dark">
            CHOOSE A TOPIC TO START YOUR QUEST
          </p>
        </motion.div>

        {/* Topic Grid */}
        {topics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((t, i) => {
              return (
                <motion.div
                  key={t.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/study?topic=${encodeURIComponent(t.title || t)}`}>
                    <motion.div
                      className="bg-white/90 border-4 border-retro-dark rounded-lg p-6 h-full flex flex-col cursor-pointer shadow-lg relative overflow-hidden"
                      whileHover={{ scale: 1.05, y: -6 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Decorative corner */}
                      <div className="absolute top-0 right-0 w-12 h-12 bg-retro-softYellow border-l-4 border-b-4 border-retro-dark"></div>

                      {/* Title */}
                      <h3 className="font-pixel text-sm text-retro-dark mb-4 relative z-10">{(t.title || t).toUpperCase()}</h3>

                      {/* Description (if available) */}
                      {t.description && (
                        <p className="text-xs text-gray-700 mb-3 relative z-10">{t.description}</p>
                      )}

                      {/* Difficulty badge (if available) */}
                      {t.difficulty && (
                        <span className={`font-pixel text-xs px-2 py-1 border-2 rounded inline-block mb-3 ${DIFFICULTY_COLORS[t.difficulty] || 'text-gray-700 border-gray-400'}`}>
                          {t.difficulty.toUpperCase()}
                        </span>
                      )}

                      {/* Icon */}
                      <div className="text-4xl mb-4">
                        {['🎯', '🚀', '⚡', '🎮', '💡', '🏆', '🎨', '🔥'][i % 8]}
                      </div>

                      {/* CTA */}
                      <div className="mt-auto">
                        <span className="retro-btn bg-retro-grassGreen text-white border-retro-dark text-xs inline-block">
                          ▶ START LEARNING
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
            className="bg-white/90 border-4 border-retro-dark rounded-lg p-8 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📚</div>
            <p className="font-pixel text-sm text-retro-dark mb-4">NO TOPICS AVAILABLE</p>
            <p className="font-pixel text-xs text-gray-700 mb-6">
              Set your interests first to see personalized topics!
            </p>
            <Link to="/interests">
              <motion.button
                className="retro-btn bg-retro-softYellow text-retro-dark border-retro-orangeAccent text-xs"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
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
            <motion.button
              className="font-pixel text-xs text-retro-dark hover:text-retro-orangeAccent transition-colors"
              whileHover={{ x: -4 }}
            >
              ← BACK TO DASHBOARD
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
