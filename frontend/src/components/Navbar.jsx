import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 bg-retro-warmSand/95 backdrop-blur-sm border-b-4 border-retro-dark shadow-lg"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🎮
          </motion.span>
          <span className="font-pixel text-retro-dark text-sm group-hover:text-retro-orangeAccent transition-colors">
            AI QUEST
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <motion.button
              className="font-pixel text-xs text-retro-dark hover:text-retro-orangeAccent transition-colors"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              📊 STATS
            </motion.button>
          </Link>
          <Link to="/learn">
            <motion.button
              className="font-pixel text-xs text-retro-dark hover:text-retro-grassGreen transition-colors"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              📚 LEARN
            </motion.button>
          </Link>
          <motion.button
            onClick={handleLogout}
            className="retro-btn bg-retro-orangeAccent text-white border-retro-dark font-pixel text-xs px-4 py-1"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            ✖ LOGOUT
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
