import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function Login() {
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
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
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
        <h2 className="font-pixel text-retro-cyan text-xl text-center mb-2">🎮 LOGIN</h2>
        <p className="font-pixel text-xs text-gray-600 dark:text-gray-400 text-center mb-8">
          ENTER YOUR CREDENTIALS
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
            />
          </div>

          <motion.button
            type="submit"
            className="retro-btn bg-retro-cyan text-retro-dark border-cyan-600 w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? '⏳ LOADING...' : '▶ LOGIN'}
          </motion.button>
        </form>

        <p className="font-pixel text-xs text-gray-600 dark:text-gray-400 text-center mt-6">
          NEW PLAYER?{' '}
          <Link to="/signup" className="text-retro-yellow hover:text-retro-green">
            SIGN UP
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
