import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import XPBar from '../components/XPBar';
import LearningPathMap from '../components/LearningPathMap';

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
  const [levelUpShown, setLevelUpShown] = useState(false);
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
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        // If unauthorized, the interceptor will redirect to login
        // For other errors, set a default profile to prevent blank page
        if (error.response?.status !== 401) {
          setProfile({ 
            username: 'Player', 
            xp: 0, 
            level: 1, 
            completed_topics: [] 
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-retro-skyBlue via-retro-lightCream to-retro-grassGreen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.p 
            className="font-pixel text-retro-orangeAccent text-xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⏳ LOADING...
          </motion.p>
          <p className="font-pixel text-xs text-retro-dark">
            PREPARING YOUR DASHBOARD
          </p>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-retro-skyBlue via-retro-lightCream to-retro-grassGreen flex items-center justify-center px-4">
        <motion.div
          className="bg-white/90 border-4 border-retro-dark rounded-lg p-8 text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-6xl mb-4">😕</p>
          <h2 className="font-pixel text-retro-orangeAccent text-lg mb-2">OOPS!</h2>
          <p className="font-pixel text-xs text-gray-700 mb-6">
            Unable to load your profile. Please try logging in again.
          </p>
          <Link to="/login">
            <motion.button
              className="retro-btn bg-retro-softYellow text-retro-dark border-retro-orangeAccent text-xs px-6 py-3"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 GO TO LOGIN
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const nextLevel = profile.level < 4 ? profile.level + 1 : 4;
  const currentThreshold = LEVEL_THRESHOLDS[profile.level] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[nextLevel] || 250;
  const progressPercent = Math.min(
    ((profile.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100,
    100
  );

  const avatar = AVATARS[(profile.username || '').length % AVATARS.length];
  
  // Generate recommended topics from user's topics list
  const recommendedTopics = topics.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-skyBlue via-retro-lightCream to-retro-grassGreen pt-20 px-4 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          className="bg-white/90 border-4 border-retro-dark rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Avatar */}
          <motion.div
            className="text-6xl bg-retro-orangeAccent p-4 rounded-full border-4 border-retro-dark"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.1, rotate: 360 }}
          >
            {avatar}
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="font-pixel text-retro-dark text-xl mb-1">
              WELCOME BACK, {(profile.username || 'PLAYER').toUpperCase()}!
            </h1>
            <p className="font-pixel text-xs text-retro-orangeAccent mb-3">
              {LEVEL_TITLES[profile.level] || 'ROOKIE'} — LEVEL {profile.level} 🏆
            </p>

            {/* XP Bar */}
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="font-pixel text-xs text-retro-dark">
                  LVL {profile.level}
                </span>
                <span className="font-pixel text-xs text-gray-600">
                  {profile.xp} / {nextThreshold} XP
                </span>
                <span className="font-pixel text-xs text-retro-dark">
                  LVL {nextLevel}
                </span>
              </div>
              <XPBar percentage={progressPercent} />
            </div>
          </div>

          {/* Stats Mini Cards */}
          <div className="flex gap-4">
            <motion.div 
              className="text-center bg-retro-softYellow p-3 rounded border-2 border-retro-dark"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <p className="font-pixel text-2xl text-retro-dark">{profile.xp}</p>
              <p className="font-pixel text-xs text-gray-600">XP</p>
            </motion.div>
            <motion.div 
              className="text-center bg-retro-green p-3 rounded border-2 border-retro-dark"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <p className="font-pixel text-2xl text-white">{profile.completed_topics?.length || 0}</p>
              <p className="font-pixel text-xs text-white">DONE</p>
            </motion.div>
            <motion.div 
              className="text-center bg-retro-blue p-3 rounded border-2 border-retro-dark"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <p className="font-pixel text-2xl text-white">{profile.level}</p>
              <p className="font-pixel text-xs text-white">LVL</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Learning Path Map - FEATURED */}
        {topics.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LearningPathMap 
              topics={topics} 
              currentTopic={null}
            />
          </motion.div>
        )}

        {/* Topic Input Section */}
        <motion.div
          className="bg-white/90 border-4 border-retro-dark rounded-lg p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-pixel text-sm text-retro-dark mb-3">🚀 JUMP TO ANY TOPIC</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGoTopic()}
              className="flex-1 bg-retro-lightCream border-2 border-retro-dark focus:border-retro-orangeAccent font-pixel text-xs text-retro-dark px-4 py-3 focus:outline-none transition-colors"
              placeholder="e.g. Binary Search, React Hooks..."
            />
            <motion.button
              onClick={handleGoTopic}
              disabled={!topicInput.trim()}
              className="retro-btn bg-retro-softYellow text-retro-dark border-retro-orangeAccent font-pixel text-xs px-6 disabled:opacity-40"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              GO →
            </motion.button>
          </div>
        </motion.div>

        {/* Main Grid: Recommended topics + Daily Challenges side-by-side */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Recommended Topics (left) */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white/90 border-4 border-retro-dark rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-pixel text-sm text-retro-orangeAccent mb-4">✨ SUGGESTED TOPICS FOR YOU</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {recommendedTopics.map((topic, idx) => (
                  <motion.div
                    key={topic.id || idx}
                    className="bg-gradient-to-br from-retro-softYellow to-retro-warmSand border-3 border-retro-dark p-4 hover:border-retro-orangeAccent transition-all cursor-pointer group rounded-lg shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + 0.05 * idx }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    onClick={() => navigate(`/study?topic=${encodeURIComponent(topic.title || topic)}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-pixel text-xs text-retro-dark group-hover:text-retro-orangeAccent transition-colors">
                        {(topic.title || topic).toUpperCase()}
                      </h3>
                      <span className="text-sm">📚</span>
                    </div>
                    <p className="text-xs text-gray-700 font-sans">
                      {topic.description || 'Click to learn more and earn XP.'}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Daily Challenges (right) */}
          <motion.div
            className="bg-white/90 border-4 border-retro-dark rounded-lg p-6 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-pixel text-sm text-retro-orangeAccent mb-4">🎯 DAILY CHALLENGES</h3>
            <div className="space-y-3">
              {DAILY_CHALLENGES.map((challenge, idx) => (
                <motion.div
                  key={idx}
                  className="bg-retro-lightCream border-2 border-retro-dark p-3 hover:border-retro-grassGreen transition-colors rounded"
                  whileHover={{ scale: 1.03, x: 4 }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{challenge.icon}</span>
                    <div className="flex-1">
                      <p className="font-pixel text-xs text-retro-dark mb-1">{challenge.title}</p>
                      <p className="text-xs text-gray-700 font-sans mb-2">{challenge.desc}</p>
                      <span className="inline-flex items-center gap-1 bg-retro-grassGreen text-white font-pixel text-xs px-2 py-1 rounded border border-retro-dark">
                        +{challenge.xp} XP
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Continue Learning Section */}
        {topics.length > 0 && (
          <motion.div
            className="bg-white/90 border-4 border-retro-dark rounded-lg p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-pixel text-sm text-retro-orangeAccent mb-4">📖 CONTINUE LEARNING</h3>
            <div className="space-y-3">
              {topics.slice(0, 3).map((t, idx) => (
                <motion.div
                  key={t.id || idx}
                  className="flex items-center justify-between bg-retro-lightCream border-2 border-retro-dark p-4 hover:border-retro-grassGreen transition-colors rounded"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + 0.05 * idx }}
                  whileHover={{ scale: 1.02, x: 4 }}
                >
                  <div>
                    <p className="font-pixel text-xs text-retro-dark mb-1">{(t.title || t).toUpperCase()}</p>
                    <p className="text-xs text-gray-700">Resume your studies</p>
                  </div>
                  <Link to={`/study?topic=${encodeURIComponent(t.title || t)}`}>
                    <motion.button
                      className="retro-btn bg-retro-grassGreen text-white border-retro-dark font-pixel text-xs px-4 py-2"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      CONTINUE →
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Completed Topics */}
        {profile.completed_topics && profile.completed_topics.length > 0 && (
          <motion.div
            className="bg-white/90 border-4 border-retro-dark rounded-lg p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-pixel text-sm text-retro-grassGreen mb-4">✅ COMPLETED TOPICS</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {profile.completed_topics.map((ct, idx) => (
                <motion.div
                  key={idx}
                  className="bg-retro-grassGreen/20 border-2 border-retro-grassGreen p-3 flex items-center gap-2 rounded"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + 0.05 * idx }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <span className="text-lg">✅</span>
                  <p className="font-pixel text-xs text-retro-dark">{ct.toUpperCase()}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/learn">
            <motion.button
              className="retro-btn bg-retro-skyBlue text-white border-retro-dark font-pixel text-xs px-6 py-3 shadow-lg"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              🔍 BROWSE TOPICS
            </motion.button>
          </Link>
          <Link to="/interests">
            <motion.button
              className="retro-btn bg-retro-orangeAccent text-white border-retro-dark font-pixel text-xs px-6 py-3 shadow-lg"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚡ UPDATE INTERESTS
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
