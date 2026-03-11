import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 border-b-2 border-retro-yellow bg-retro-darker/95 dark:bg-retro-darker/95 light-nav"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-lg">🎮</span>
          <span className="font-pixel text-retro-yellow text-xs">AI SUPER QUEST</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="font-pixel text-xs text-gray-700 dark:text-gray-300 hover:text-retro-cyan transition-colors"
          >
            📊 STATS
          </Link>
          <Link
            to="/learn"
            className="font-pixel text-xs text-gray-700 dark:text-gray-300 hover:text-retro-green transition-colors"
          >
            📚 LEARN
          </Link>
          <button
            onClick={toggleTheme}
            className="font-pixel text-sm px-2 py-1 text-retro-yellow hover:text-retro-cyan transition-colors"
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={handleLogout}
            className="font-pixel text-xs text-gray-600 dark:text-gray-400 hover:text-retro-red transition-colors"
          >
            ✖ LOGOUT
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
