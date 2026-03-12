import { motion } from 'framer-motion';

export default function PlayerMarker({ position }) {
  return (
    <motion.div
      className="absolute z-50"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        y: [0, -8, 0],
      }}
      transition={{
        scale: { type: 'spring', duration: 0.6 },
        rotate: { type: 'spring', duration: 0.6 },
        y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
      }}
    >
      {/* Player character */}
      <div className="relative">
        {/* Character body */}
        <motion.div
          className="w-16 h-16 bg-retro-orangeAccent rounded-full border-4 border-retro-dark flex items-center justify-center"
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-2xl">🚀</span>
        </motion.div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-retro-cyan opacity-20 blur-lg"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Trail particles */}
        <motion.div
          className="absolute left-1/2 top-full w-2 h-2 bg-retro-softYellow rounded-full"
          animate={{ 
            y: [0, 15, 30],
            opacity: [1, 0.5, 0],
            scale: [1, 0.8, 0.3]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
