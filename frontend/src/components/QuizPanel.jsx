import { useState } from 'react';
import { motion } from 'framer-motion';
import { playClick, playCorrect, playWrong, playXP } from '../utils/sounds';

export default function QuizPanel({ quiz, loading, onSubmit, result, nextTopic, onNextTopic }) {
  const [answers, setAnswers] = useState({});

  const selectAnswer = (questionIdx, option) => {
    if (result) return; // locked after submit
    playClick();
    setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
    // Sound feedback will be triggered by parent via result prop
  };

  // Play sound when result appears
  const [soundPlayed, setSoundPlayed] = useState(false);
  if (result && !soundPlayed) {
    setSoundPlayed(true);
    if (result.score === result.total) {
      playCorrect();
    } else if (result.score < result.total / 2) {
      playWrong();
    } else {
      playXP();
    }
  }

  if (loading) {
    return (
      <motion.div
        className="retro-panel p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="font-pixel text-retro-green text-xs"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            GENERATING QUIZ...
          </motion.span>
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            🎲
          </motion.span>
        </div>
      </motion.div>
    );
  }

  if (!quiz) return null;

  return (
    <motion.div
      className="retro-panel p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <h3 className="font-pixel text-base text-retro-green mb-6">📝 QUIZ TIME</h3>

      <div className="space-y-6">
        {quiz.map((q, qi) => (
          <motion.div
            key={qi}
            className="bg-white/30 dark:bg-retro-darker/50 border border-retro-purple p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: qi * 0.1 }}
          >
            <p className="font-pixel text-xs text-retro-cyan mb-3">
              Q{qi + 1}. {q.question}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.options.map((option, oi) => {
                const isSelected = answers[qi] === option;
                const isCorrect = result && option === q.answer;
                const isWrong = result && isSelected && option !== q.answer;

                let borderColor = 'border-gray-600';
                let bgColor = 'bg-transparent';
                if (isSelected && !result) {
                  borderColor = 'border-retro-yellow';
                  bgColor = 'bg-retro-yellow/10';
                }
                if (isCorrect) {
                  borderColor = 'border-retro-green';
                  bgColor = 'bg-retro-green/10';
                }
                if (isWrong) {
                  borderColor = 'border-retro-red';
                  bgColor = 'bg-retro-red/10';
                }

                return (
                  <motion.button
                    key={oi}
                    onClick={() => selectAnswer(qi, option)}
                    className={`text-left font-pixel text-xs p-3 border-2 ${borderColor} ${bgColor} transition-all`}
                    whileHover={!result ? { scale: 1.02 } : {}}
                    whileTap={!result ? { scale: 0.98 } : {}}
                  >
                    {isCorrect && '✅ '}
                    {isWrong && '❌ '}
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit / Result */}
      {!result ? (
        <motion.button
          onClick={handleSubmit}
          className="retro-btn bg-retro-yellow text-retro-dark border-yellow-600 mt-6 text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={Object.keys(answers).length < quiz.length}
        >
          ✅ SUBMIT ANSWERS
        </motion.button>
      ) : (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Summary Card */}
          <div className="retro-panel p-6 text-center mb-6">
            <p className="font-pixel text-lg text-retro-yellow mb-2">
              SCORE: {result.score}/{result.total}
            </p>
            <p className="font-pixel text-xs text-retro-green mb-1">
              +{result.xp_earned} XP EARNED 🪙
            </p>
            {result.total_xp !== undefined && (
              <p className="font-pixel text-xs text-gray-600 dark:text-gray-400">
                TOTAL XP: {result.total_xp} | LEVEL: {result.level}
              </p>
            )}
            {result.score === result.total && (
              <motion.p
                className="font-pixel text-xs text-retro-cyan mt-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                🏆 PERFECT SCORE!
              </motion.p>
            )}
          </div>

          {/* Detailed Result Report */}
          <div className="retro-panel p-6 mb-6">
            <h3 className="font-pixel text-sm text-retro-cyan mb-4">📋 RESULT REPORT</h3>
            <div className="space-y-4">
              {quiz.map((q, qi) => {
                const userAnswer = answers[qi] || '—';
                const isCorrect = userAnswer === q.answer;
                return (
                  <motion.div
                    key={qi}
                    className={`border-2 p-4 ${
                      isCorrect
                        ? 'border-retro-green/60 bg-retro-green/5'
                        : 'border-retro-red/60 bg-retro-red/5'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: qi * 0.08 }}
                  >
                    <p className="font-pixel text-xs text-retro-cyan mb-2">
                      QUESTION {qi + 1}
                    </p>
                    <p className="font-pixel text-xs text-gray-300 mb-3">{q.question}</p>
                    <div className="space-y-1">
                      <p className="font-pixel text-[10px] text-gray-400">
                        YOUR ANSWER:{' '}
                        <span className={isCorrect ? 'text-retro-green' : 'text-retro-red'}>
                          {userAnswer}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="font-pixel text-[10px] text-gray-400">
                          CORRECT ANSWER:{' '}
                          <span className="text-retro-green">{q.answer}</span>
                        </p>
                      )}
                      <p className="font-pixel text-xs mt-1">
                        {isCorrect ? (
                          <span className="text-retro-green">✅ CORRECT</span>
                        ) : (
                          <span className="text-retro-red">❌ WRONG</span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Next Topic Button */}
          {nextTopic && onNextTopic && (
            <div className="text-center">
              <motion.button
                onClick={onNextTopic}
                className="retro-btn bg-retro-cyan text-retro-dark border-cyan-600 text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                NEXT TOPIC →
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
