import { motion } from 'framer-motion';

export default function XPBar({ percentage }) {
  return (
    <div className="w-full h-6 bg-retro-darker border-2 border-retro-yellow relative overflow-hidden">
      <motion.div
        className="h-full"
        style={{
          background: 'linear-gradient(90deg, #00ff88, #00e5ff, #ffd700)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      {/* Pixel segments */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.2) 8px, rgba(0,0,0,0.2) 10px)',
        }}
      />
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-pixel text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
