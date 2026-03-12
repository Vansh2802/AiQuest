import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        setSuccess(true);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
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

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className="bg-retro-red/20 border-2 border-retro-red text-retro-red font-pixel text-xs p-3 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              ⚠ {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="bg-retro-green/20 border-2 border-retro-green text-retro-green font-pixel text-xs p-3 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.5 }}
                >
                  ✓
                </motion.span>
                <span>LOGIN SUCCESSFUL! REDIRECTING...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              disabled={loading || success}
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
              disabled={loading || success}
            />
          </div>

          <motion.button
            type="submit"
            className={`retro-btn bg-retro-cyan text-retro-dark border-cyan-600 w-full ${
              (loading || success) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            whileHover={!loading && !success ? { scale: 1.02, y: -2 } : {}}
            whileTap={!loading && !success ? { scale: 0.98 } : {}}
            disabled={loading || success}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ⏳
                </motion.span>
                LOGGING IN...
              </span>
            ) : success ? (
              '✓ SUCCESS!'
            ) : (
              '▶ LOGIN'
            )}
          </motion.button>
        </form>

        <p className="font-pixel text-xs text-gray-600 dark:text-gray-400 text-center mt-6">
          NEW PLAYER?{' '}
          <Link to="/signup" className="text-retro-yellow hover:text-retro-green transition-colors">
            SIGN UP
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link to="/" className="font-pixel text-xs text-gray-600 dark:text-gray-500 hover:text-retro-cyan transition-colors">
            ← BACK TO START
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
