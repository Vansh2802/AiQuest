import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const INTEREST_OPTIONS = [
  { id: 'Web Development', icon: '🌐', color: 'border-retro-cyan', bg: 'bg-retro-cyan/10' },
  { id: 'Data Structures', icon: '🏗️', color: 'border-retro-yellow', bg: 'bg-retro-yellow/10' },
  { id: 'Algorithms', icon: '⚡', color: 'border-retro-green', bg: 'bg-retro-green/10' },
  { id: 'Python', icon: '🐍', color: 'border-retro-blue', bg: 'bg-blue-500/10' },
  { id: 'Machine Learning', icon: '🤖', color: 'border-retro-pink', bg: 'bg-retro-pink/10' },
  { id: 'Data Science', icon: '📊', color: 'border-retro-orange', bg: 'bg-retro-orange/10' },
  { id: 'JavaScript', icon: '✨', color: 'border-retro-yellow', bg: 'bg-retro-yellow/10' },
];

export default function Interests() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selected.length === 0) {
      setError('Select at least one interest!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/user/interests', { interests: selected });
      navigate('/dashboard');
    } catch {
      setError('Failed to save interests. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-retro-skyBlue via-retro-lightCream to-retro-grassGreen px-4 py-10">
      <motion.div
        className="bg-white/90 border-4 border-retro-dark rounded-lg shadow-lg p-8 w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-pixel text-retro-orangeAccent text-xl text-center mb-2">🎯 CHOOSE YOUR PATH</h2>
        <p className="font-pixel text-xs text-gray-700 text-center mb-8">
          WHAT DO YOU WANT TO LEARN? (SELECT ONE OR MORE)
        </p>

        {error && (
          <motion.div
            className="bg-retro-red/20 border border-retro-red text-retro-red font-pixel text-xs p-3 mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠ {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {INTEREST_OPTIONS.map((item, i) => {
            const isSelected = selected.includes(item.id);
            return (
              <motion.button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`text-left p-4 border-2 rounded-lg transition-all ${
                  isSelected
                    ? `${item.color} ${item.bg} shadow-lg scale-105`
                    : 'border-gray-300 bg-white/50 hover:border-retro-orangeAccent'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-pixel text-xs text-retro-dark">{item.id.toUpperCase()}</p>
                    {isSelected && (
                      <motion.p
                        className="font-pixel text-xs text-retro-grassGreen mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        ✓ SELECTED
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="text-center">
          <p className="font-pixel text-xs text-gray-700 mb-4">
            {selected.length} INTEREST{selected.length !== 1 ? 'S' : ''} SELECTED
          </p>
          <motion.button
            onClick={handleContinue}
            className="retro-btn bg-retro-softYellow text-retro-dark border-retro-orangeAccent text-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? '⏳ SAVING...' : '▶ CONTINUE TO DASHBOARD'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
