import { motion } from 'framer-motion';
import { playClick } from '../utils/sounds';

export default function LevelNode({ topic, status, position, onClick, isActive }) {
  const getNodeColor = () => {
    if (status === 'completed') return 'bg-retro-green border-green-600';
    if (status === 'unlocked') return 'bg-retro-softYellow border-yellow-600';
    return 'bg-gray-400 border-gray-600';
  };

  const getIcon = () => {
    if (status === 'completed') return '✓';
    if (status === 'locked') return '🔒';
    return '📚';
  };

  const isClickable = status !== 'locked';

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: position.x / 100 * 0.3 }}
    >
      <motion.button
        onClick={() => {
          if (isClickable) {
            playClick();
            onClick(topic);
          }
        }}
        className={`relative w-24 h-24 rounded-full border-4 ${getNodeColor()} 
          flex flex-col items-center justify-center gap-1 transition-all
          ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
          ${isActive ? 'ring-4 ring-retro-cyan' : ''}`}
        whileHover={isClickable ? { scale: 1.1, y: -5 } : {}}
        whileTap={isClickable ? { scale: 0.95 } : {}}
        disabled={!isClickable}
      >
        {/* Floating animation for unlocked nodes */}
        {status === 'unlocked' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-retro-orangeAccent opacity-30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Icon */}
        <motion.span
          className="text-2xl"
          animate={status === 'unlocked' ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          {getIcon()}
        </motion.span>

        {/* Topic name */}
        <span className="font-pixel text-[6px] text-center px-1 leading-tight text-retro-dark">
          {topic.title.split(' ').slice(0, 2).join(' ')}
        </span>

        {/* Sparkles for completed */}
        {status === 'completed' && (
          <>
            <motion.span
              className="absolute -top-2 -right-2 text-xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute -bottom-2 -left-2 text-xl"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              ⭐
            </motion.span>
          </>
        )}
      </motion.button>

      {/* Connection line to next node */}
      <svg
        className="absolute left-full top-1/2 -translate-y-1/2"
        width="100"
        height="4"
        style={{ pointerEvents: 'none' }}
      >
        <motion.line
          x1="0"
          y1="2"
          x2="100"
          y2="2"
          stroke={status === 'completed' ? '#4ECB71' : '#D1D5DB'}
          strokeWidth="4"
          strokeDasharray="8 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: status === 'completed' ? 1 : 0.3 }}
          transition={{ duration: 0.8 }}
        />
      </svg>
    </motion.div>
  );
}
