import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Landing() {
  const { scrollY } = useScroll();
  
  // Parallax effects
  const skyY = useTransform(scrollY, [0, 500], [0, -50]);
  const mountainY = useTransform(scrollY, [0, 500], [0, -100]);
  const treeY = useTransform(scrollY, [0, 500], [0, -150]);
  const grassY = useTransform(scrollY, [0, 500], [0, -200]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-retro-skyBlue">
      {/* Sky Layer */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-retro-skyBlue via-retro-lightCream to-retro-grassGreen"
        style={{ y: skyY }}
      >
        {/* Sun */}
        <motion.div
          className="absolute top-20 right-20 w-24 h-24 bg-retro-softYellow rounded-full border-4 border-retro-orangeAccent"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-retro-orangeAccent opacity-40"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Clouds */}
        {[{ x: '10%', y: '10%', delay: 0 }, { x: '60%', y: '15%', delay: 2 }, { x: '80%', y: '8%', delay: 4 }].map((cloud, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: cloud.x, top: cloud.y }}
            animate={{ x: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: cloud.delay }}
          >
            <span className="text-6xl">☁️</span>
          </motion.div>
        ))}

        {/* Birds */}
        <motion.div
          className="absolute top-32 left-1/4"
          animate={{ x: [-100, 1000], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        >
          <span className="text-2xl">🐦</span>
        </motion.div>
      </motion.div>

      {/* Mountain Layer */}
      <motion.div 
        className="absolute bottom-0 w-full h-64"
        style={{ y: mountainY }}
      >
        <svg viewBox="0 0 1200 300" className="w-full h-full">
          {/* Mountain silhouettes */}
          <polygon
            points="0,300 300,100 500,200 800,80 1000,180 1200,120 1200,300"
            fill="#9B7EDE"
            opacity="0.6"
          />
          <polygon
            points="0,300 200,150 400,200 600,100 800,170 1000,130 1200,200 1200,300"
            fill="#7B5EBE"
            opacity="0.8"
          />
        </svg>
      </motion.div>

      {/* Tree Layer */}
      <motion.div 
        className="absolute bottom-32 w-full flex justify-around px-8"
        style={{ y: treeY }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="text-6xl"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
          >
            🌲
          </motion.div>
        ))}
      </motion.div>

      {/* Grass/Ground Layer */}
      <motion.div 
        className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-retro-grassGreen to-transparent"
        style={{ y: grassY }}
      >
        <div className="flex justify-around px-4 pt-4">
          {[...Array(12)].map((_, i) => (
            <motion.span
              key={i}
              className="text-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1 + i * 0.1, repeat: Infinity, delay: i * 0.1 }}
            >
              🌱
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Floating Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Coins */}
        {[{ x: '15%', y: '25%' }, { x: '75%', y: '30%' }, { x: '85%', y: '60%' }, { x: '20%', y: '70%' }].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{ left: pos.x, top: pos.y }}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.5 }}
          >
            🪙
          </motion.div>
        ))}

        {/* Stars/Sparkles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Pixel Character */}
        <motion.div
          className="mb-8"
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 bg-retro-orangeAccent rounded-2xl border-4 border-retro-dark flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
            >
              <span className="text-6xl">💻</span>
            </motion.div>
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-retro-cyan opacity-20 blur-xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h1
            className="font-pixel text-5xl md:text-7xl mb-3"
            style={{
              background: 'linear-gradient(45deg, #FFD700, #FF8C42, #FFD700)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '4px 4px 0px rgba(0,0,0,0.2)',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
          >
            AI QUEST
          </motion.h1>
          
          <motion.div
            className="flex items-center justify-center gap-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-2xl">⭐</span>
            <p className="font-pixel text-sm text-retro-dark">
              LEARN • PLAY • LEVEL UP
            </p>
            <span className="text-2xl">⭐</span>
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-pixel text-xs md:text-sm text-retro-dark mb-12 max-w-lg mx-auto leading-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Embark on an adventure through AI concepts!
          <br />
          Learn, quiz, and earn XP in this retro learning world.
        </motion.p>

        {/* Blinking "Press Start" text */}
        <motion.p
          className="font-pixel text-retro-orangeAccent text-sm mb-8 animate-pixel-blink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ▶ PRESS START ◀
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/signup">
            <motion.button
              className="retro-btn bg-retro-softYellow text-retro-dark border-retro-orangeAccent  px-8 py-4"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚔ START LEARNING
            </motion.button>
          </Link>

          <Link to="/login">
            <motion.button
              className="retro-btn bg-retro-green text-white border-green-700 px-8 py-4"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 CONTINUE QUEST
            </motion.button>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {[
            { icon: '🤖', title: 'AI Tutor', desc: 'Personalized explanations' },
            { icon: '🎯', title: 'Interactive Quizzes', desc: 'Test your knowledge' },
            { icon: '🏆', title: 'Level Up System', desc: 'Earn XP & unlock topics' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white/90 border-4 border-retro-dark rounded-lg p-6 text-center"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className="text-5xl mb-3"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 + i }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="font-pixel text-xs text-retro-dark mb-2">{feature.title}</h3>
              <p className="text-[10px] text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Grass decoration at bottom */}
      <div className="absolute bottom-0 w-full h-8 bg-retro-grassGreen border-t-4 border-retro-dark flex items-center justify-around">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="text-xl">🌼</span>
        ))}
      </div>
    </div>
  );
}

