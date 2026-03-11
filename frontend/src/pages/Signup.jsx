import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { username, email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/interests');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-retro-darker via-retro-dark to-retro-purple px-4">
      <motion.div
        className="retro-panel p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-pixel text-retro-green text-xl text-center mb-2">🌟 SIGN UP</h2>
        <p className="font-pixel text-xs text-gray-600 dark:text-gray-400 text-center mb-8">
          CREATE YOUR PLAYER ACCOUNT
        </p>

        {error && (
          <motion.div
            className="bg-retro-red/20 border border-retro-red text-retro-red font-pixel text-xs p-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-pixel text-xs text-retro-yellow block mb-2">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="retro-input"
              placeholder="hero_player_01"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="font-pixel text-xs text-retro-yellow block mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="retro-input"
              placeholder="player@quest.com"
              required
            />
          </div>

          <div>
            <label className="font-pixel text-xs text-retro-yellow block mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="retro-input"
              placeholder="********"
              required
              minLength={6}
            />
          </div>

          <motion.button
            type="submit"
            className="retro-btn bg-retro-green text-retro-dark border-green-600 w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? '⏳ CREATING...' : '⚔ CREATE ACCOUNT'}
          </motion.button>
        </form>

        <p className="font-pixel text-xs text-gray-600 dark:text-gray-400 text-center mt-6">
          ALREADY A PLAYER?{' '}
          <Link to="/login" className="text-retro-cyan hover:text-retro-green">
            LOGIN
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link to="/" className="font-pixel text-xs text-gray-600 dark:text-gray-500 hover:text-retro-cyan">
            ← BACK TO START
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
