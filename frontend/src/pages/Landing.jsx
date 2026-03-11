import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: Math.random() * 3,
  size: Math.random() > 0.7 ? 3 : 2,
}));

const coins = [
  { left: '10%', top: '20%', delay: 0 },
  { left: '85%', top: '15%', delay: 0.5 },
  { left: '75%', top: '70%', delay: 1 },
  { left: '15%', top: '75%', delay: 1.5 },
];

const clouds = [
  { left: '5%', top: '10%', delay: 0, width: 60 },
  { left: '70%', top: '8%', delay: 2, width: 80 },
  { left: '40%', top: '5%', delay: 4, width: 50 },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-retro-darker via-retro-dark to-retro-purple">
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="pixel-star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Pixel Clouds */}
      {clouds.map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          style={{ left: cloud.left, top: cloud.top }}
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: cloud.delay }}
        >
          <div className="flex gap-0">
            <div className="bg-white" style={{ width: cloud.width * 0.3, height: 8 }} />
            <div className="bg-white -mt-2" style={{ width: cloud.width * 0.5, height: 12 }} />
            <div className="bg-white" style={{ width: cloud.width * 0.3, height: 8 }} />
          </div>
        </motion.div>
      ))}

      {/* Coins */}
      {coins.map((coin, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ left: coin.left, top: coin.top }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: coin.delay }}
        >
          🪙
        </motion.div>
      ))}

      {/* Question Blocks */}
      <motion.div
        className="absolute text-3xl"
        style={{ right: '20%', top: '30%' }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ❓
      </motion.div>
      <motion.div
        className="absolute text-3xl"
        style={{ left: '22%', top: '35%' }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
      >
        ❓
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="font-pixel text-retro-yellow text-3xl md:text-5xl mb-2 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
            AI SUPER
          </h1>
          <h1 className="font-pixel text-retro-cyan text-4xl md:text-6xl mb-6 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
            QUEST
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-pixel text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Learn concepts with AI and level up your knowledge.
        </motion.p>

        {/* Blinking "Press Start" text */}
        <motion.p
          className="font-pixel text-retro-yellow text-xs mb-8 animate-pixel-blink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ▶ PRESS START ◀
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/signup">
            <motion.button
              className="retro-btn bg-retro-yellow text-retro-dark border-yellow-600 w-64 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚔ START LEARNING
            </motion.button>
          </Link>

          <Link to="/login">
            <motion.button
              className="retro-btn bg-retro-cyan text-retro-dark border-cyan-600 w-64 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 LOGIN
            </motion.button>
          </Link>

          <Link to="/signup">
            <motion.button
              className="retro-btn bg-retro-green text-retro-dark border-green-600 w-64 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🌟 SIGN UP
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer pixel art decoration */}
        <motion.div
          className="mt-16 flex justify-center gap-3 text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>🏆</motion.span>
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>⭐</motion.span>
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🎯</motion.span>
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}>💎</motion.span>
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}>🚀</motion.span>
        </motion.div>
      </motion.div>

      {/* Ground pixel decoration */}
      <div className="absolute bottom-0 w-full h-8 bg-retro-green opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0,0,0,0.2) 16px, rgba(0,0,0,0.2) 32px)',
        }}
      />
    </div>
  );
}
