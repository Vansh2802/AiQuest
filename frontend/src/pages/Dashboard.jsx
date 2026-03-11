import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import XPBar from '../components/XPBar';

const LEVEL_THRESHOLDS = { 1: 0, 2: 50, 3: 120, 4: 250 };
const LEVEL_TITLES = { 1: 'ROOKIE', 2: 'APPRENTICE', 3: 'WARRIOR', 4: 'LEGEND' };
const AVATARS = ['🧙', '🦸', '🥷', '🧑‍🚀', '🦊', '🐉', '🤖', '🎮'];

const DAILY_CHALLENGES = [
  { title: 'Study a New Topic', desc: 'Open the learning page and explore a topic', xp: 20, icon: '📖' },
  { title: 'Ace a Quiz', desc: 'Score 100% on any quiz', xp: 50, icon: '🏆' },
  { title: 'Ask the AI Tutor', desc: 'Chat with the AI tutor about a concept', xp: 10, icon: '💬' },
];

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicInput, setTopicInput] = useState('');
  const navigate = useNavigate();

  const handleGoTopic = () => {
    const t = topicInput.trim();
    if (!t) return;
    navigate(`/study?topic=${encodeURIComponent(t)}`);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const [profileRes, topicsRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/user/topics'),
        ]);
        setProfile(profileRes.data);
        if (topicsRes.data.ok) setTopics(topicsRes.data.topics);
      } catch {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-retro-yellow text-sm animate-pixel-blink">LOADING...</p>
      </div>
    );
  }

  if (!profile) return null;

  const nextLevel = profile.level < 4 ? profile.level + 1 : 4;
  const currentThreshold = LEVEL_THRESHOLDS[profile.level] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[nextLevel] || 250;
  const progressPercent = Math.min(
    ((profile.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100,
    100
  );

  const avatar = AVATARS[(profile.username || '').length % AVATARS.length];
  const continueLearning = topics.filter((t) => !t.completed).slice(0, 3);
  const recommended = topics.filter((t) => !t.completed).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-darker via-retro-dark to-retro-purple pt-20 px-4 pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          className="retro-panel p-6 mb-8 flex flex-col md:flex-row items-center gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Avatar */}
          <motion.div
            className="text-5xl"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {avatar}
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="font-pixel text-retro-yellow text-lg mb-1">
              WELCOME BACK, {(profile.username || 'PLAYER').toUpperCase()}!
            </h1>
            <p className="font-pixel text-xs text-gray-600 dark:text-gray-400 mb-3">
              {LEVEL_TITLES[profile.level] || 'ROOKIE'} — LEVEL {profile.level}
            </p>

            {/* XP Bar */}
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="font-pixel text-xs text-retro-cyan">
                  LVL {profile.level}
                </span>
                <span className="font-pixel text-xs text-gray-600 dark:text-gray-500">
                  {profile.xp} / {nextThreshold} XP
                </span>
                <span className="font-pixel text-xs text-retro-cyan">
                  LVL {nextLevel}
                </span>
              </div>
              <XPBar percentage={progressPercent} />
            </div>
          </div>

          {/* Stats Mini Cards */}
          <div className="flex gap-4">
            <div className="text-center">
              <p className="font-pixel text-2xl text-retro-yellow">{profile.xp}</p>
              <p className="font-pixel text-xs text-gray-600 dark:text-gray-500">XP</p>
            </div>
            <div className="text-center">
              <p className="font-pixel text-2xl text-retro-green">{profile.completed_topics?.length || 0}</p>
              <p className="font-pixel text-xs text-gray-600 dark:text-gray-500">DONE</p>
            </div>
            <div className="text-center">
              <p className="font-pixel text-2xl text-retro-cyan">{profile.level}</p>
              <p className="font-pixel text-xs text-gray-600 dark:text-gray-500">LVL</p>
            </div>
          </div>
        </motion.div>

        {/* Topic Input Section */}
        <motion.div
          className="retro-panel p-6 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h3 className="font-pixel text-sm text-retro-cyan mb-3">🚀 JUMP TO ANY TOPIC</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGoTopic()}
              className="flex-1 bg-white/30 dark:bg-retro-darker border-2 border-gray-600 focus:border-retro-cyan font-pixel text-xs text-gray-700 dark:text-gray-300 px-4 py-3 focus:outline-none transition-colors"
              placeholder="Switch topic... e.g Binary Search"
            />
            <motion.button
              onClick={handleGoTopic}
              disabled={!topicInput.trim()}
              className="retro-btn bg-retro-yellow text-retro-dark border-yellow-600 font-pixel text-xs px-6 disabled:opacity-40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              GO
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recommended Topics */}
          <motion.div
            className="retro-panel p-6 lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-pixel text-sm text-retro-yellow mb-4">🎯 RECOMMENDED TOPICS</h3>
            {recommended.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommended.map((t, i) => (
                  <Link key={t.id} to={`/study?topic=${encodeURIComponent(t.title)}`}>
                    <motion.div
                      className="bg-white/30 dark:bg-retro-darker/50 border border-gray-300 dark:border-gray-700 hover:border-retro-cyan p-4 transition-all cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="font-pixel text-xs text-gray-900 dark:text-white mb-1">{t.title}</p>
                      <p className="font-pixel text-xs text-gray-600 dark:text-gray-500">{t.difficulty} • {t.category}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-pixel text-xs text-gray-600 dark:text-gray-500">
                All topics completed! You're a true champion! 🏆
              </p>
            )}
          </motion.div>

          {/* Daily Challenge */}
          <motion.div
            className="retro-panel p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-pixel text-sm text-retro-green mb-4">⚡ DAILY CHALLENGE</h3>
            <div className="space-y-3">
              {DAILY_CHALLENGES.map((c, i) => (
                <div key={i} className="bg-white/30 dark:bg-retro-darker/50 border border-gray-300 dark:border-gray-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{c.icon}</span>
                    <p className="font-pixel text-xs text-gray-900 dark:text-white">{c.title}</p>
                  </div>
                  <p className="font-pixel text-xs text-gray-600 dark:text-gray-500">{c.desc}</p>
                  <p className="font-pixel text-xs text-retro-yellow mt-1">+{c.xp} XP</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Continue Learning */}
        <motion.div
          className="retro-panel p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-pixel text-sm text-retro-cyan mb-4">📖 CONTINUE LEARNING</h3>
          {continueLearning.length > 0 ? (
            <div className="space-y-3">
              {continueLearning.map((t) => (
                <Link key={t.id} to={`/study?topic=${encodeURIComponent(t.title)}`}>
                  <motion.div
                    className="flex items-center justify-between bg-white/30 dark:bg-retro-darker/50 border border-gray-300 dark:border-gray-700 hover:border-retro-green p-4 transition-all cursor-pointer mb-2"
                    whileHover={{ x: 4 }}
                  >
                    <div>
                      <p className="font-pixel text-xs text-gray-900 dark:text-white">{t.title}</p>
                      <p className="font-pixel text-xs text-gray-600 dark:text-gray-500 mt-1">{t.description}</p>
                    </div>
                    <span className="font-pixel text-xs text-retro-green">▶</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="font-pixel text-xs text-gray-600 dark:text-gray-500">No topics in progress.</p>
          )}
        </motion.div>

        {/* Completed Topics */}
        {profile.completed_topics?.length > 0 && (
          <motion.div
            className="retro-panel p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-pixel text-sm text-retro-green mb-4">
              ✅ COMPLETED ({profile.completed_topics.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profile.completed_topics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center gap-3 bg-white/30 dark:bg-retro-darker/50 border border-retro-green/30 p-3"
                >
                  <span className="text-retro-green">✅</span>
                  <span className="font-pixel text-xs text-gray-700 dark:text-gray-300 uppercase">{topic}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/learn">
            <motion.button
              className="retro-btn bg-retro-yellow text-retro-dark border-yellow-600 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📚 BROWSE TOPICS
            </motion.button>
          </Link>
          <Link to="/interests">
            <motion.button
              className="retro-btn bg-retro-purple text-white border-purple-500 text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎯 UPDATE INTERESTS
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
