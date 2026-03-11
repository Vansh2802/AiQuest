import { motion } from 'framer-motion';

export default function TopicInput({ topic, setTopic, onExplain, onQuiz, loadingExplain, loadingQuiz }) {
  return (
    <motion.div
      className="retro-panel p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <label className="font-pixel text-xs text-retro-yellow block mb-3">
        🎯 ENTER A TOPIC TO LEARN
      </label>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="retro-input mb-4"
        placeholder="e.g. Machine Learning, Photosynthesis..."
        onKeyDown={(e) => e.key === 'Enter' && onExplain()}
      />
      <div className="flex flex-wrap gap-3">
        <motion.button
          onClick={onExplain}
          className="retro-btn bg-retro-cyan text-retro-dark border-cyan-600 text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loadingExplain || !topic.trim()}
        >
          {loadingExplain ? '⏳ THINKING...' : '💡 EXPLAIN TOPIC'}
        </motion.button>

        <motion.button
          onClick={onQuiz}
          className="retro-btn bg-retro-green text-retro-dark border-green-600 text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loadingQuiz || !topic.trim()}
        >
          {loadingQuiz ? '⏳ GENERATING...' : '📝 GENERATE QUIZ'}
        </motion.button>
      </div>
    </motion.div>
  );
}
