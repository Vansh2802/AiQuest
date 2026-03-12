import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick, playCorrect, playWrong, playXP } from '../utils/sounds';

export default function QuizPanel({ quiz, loading, onSubmit, result, nextTopic, onNextTopic }) {
  const [answers, setAnswers] = useState({});
  const [soundPlayed, setSoundPlayed] = useState(false);

  const selectAnswer = (questionIdx, option) => {
    if (result) return; // locked after submit
    playClick();
    setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  // Play sound when result appears
  useEffect(() => {
    if (result && !soundPlayed) {
      setSoundPlayed(true);
      if (result.score === result.total) {
        playCorrect();
        playXP();
      } else if (result.score < result.total / 2) {
        playWrong();
      } else {
        playXP();
      }
    }
  }, [result, soundPlayed]);

  // Reset sound played flag when quiz changes
  useEffect(() => {
    setSoundPlayed(false);
  }, [quiz]);

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
      <h3 className="font-pixel text-base text-retro-green mb-6 flex items-center gap-2">
        📝 QUIZ TIME
        {!result && (
          <span className="text-xs text-gray-500">
            ({Object.keys(answers).length}/{quiz.length} answered)
          </span>
        )}
      </h3>

      <div className="space-y-6">
        {quiz.map((q, qi) => {
          const userAnswer = answers[qi];
          const isCorrect = result && userAnswer === q.answer;
          const isWrong = result && userAnswer && userAnswer !== q.answer;
          
          return (
            <motion.div
              key={qi}
              className={`border-2 p-4 transition-all ${
                result 
                  ? isCorrect 
                    ? 'border-retro-green bg-retro-green/5' 
                    : isWrong
                    ? 'border-retro-red bg-retro-red/5'
                    : 'border-gray-600 bg-white/30 dark:bg-retro-darker/50'
                  : 'border-retro-purple bg-white/30 dark:bg-retro-darker/50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: qi * 0.1 }}
            >
              <div className="flex items-start gap-2 mb-3">
                {result && (
                  <motion.span 
                    className="text-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    {isCorrect ? '✅' : isWrong ? '❌' : '⚪'}
                  </motion.span>
                )}
                <p className="font-pixel text-xs text-retro-cyan flex-1">
                  <span className="text-retro-yellow">Q{qi + 1}.</span> {q.question}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((option, oi) => {
                  const isSelected = answers[qi] === option;
                  const isCorrectOption = result && option === q.answer;
                  const isWrongOption = result && isSelected && option !== q.answer;

                  let borderColor = 'border-gray-600';
                  let bgColor = 'bg-transparent';
                  let textColor = 'text-gray-700 dark:text-gray-300';
                  
                  if (isSelected && !result) {
                    borderColor = 'border-retro-yellow';
                    bgColor = 'bg-retro-yellow/10';
                    textColor = 'text-retro-yellow';
                  }
                  if (isCorrectOption) {
                    borderColor = 'border-retro-green';
                    bgColor = 'bg-retro-green/20';
                    textColor = 'text-retro-green';
                  }
                  if (isWrongOption) {
                    borderColor = 'border-retro-red';
                    bgColor = 'bg-retro-red/20';
                    textColor = 'text-retro-red';
                  }

                  return (
                    <motion.button
                      key={oi}
                      onClick={() => selectAnswer(qi, option)}
                      className={`text-left font-pixel text-xs p-3 border-2 ${borderColor} ${bgColor} ${textColor} transition-all relative overflow-hidden`}
                      whileHover={!result ? { scale: 1.02, x: 2 } : {}}
                      whileTap={!result ? { scale: 0.98 } : {}}
                      disabled={!!result}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: qi * 0.1 + oi * 0.05 }}
                    >
                      {isCorrectOption && (
                        <motion.span 
                          className="absolute right-2 top-2 text-lg"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', delay: 0.3 }}
                        >
                          ✓
                        </motion.span>
                      )}
                      {isWrongOption && (
                        <motion.span 
                          className="absolute right-2 top-2 text-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ delay: 0.3 }}
                        >
                          ✗
                        </motion.span>
                      )}
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Submit / Result */}
      {!result ? (
        <motion.button
          onClick={handleSubmit}
          className={`retro-btn bg-retro-yellow text-retro-dark border-yellow-600 mt-6 text-xs ${
            Object.keys(answers).length < quiz.length ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={Object.keys(answers).length >= quiz.length ? { scale: 1.05, y: -2 } : {}}
          whileTap={Object.keys(answers).length >= quiz.length ? { scale: 0.95 } : {}}
          disabled={Object.keys(answers).length < quiz.length}
        >
          ✅ SUBMIT ANSWERS {Object.keys(answers).length < quiz.length && `(${Object.keys(answers).length}/${quiz.length})`}
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            className="mt-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Summary Card with Animation */}
            <motion.div 
              className="retro-panel p-6 text-center bg-gradient-to-b from-retro-purple/20 to-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <motion.p 
                className="font-pixel text-3xl mb-3"
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {result.score === result.total ? '🏆' : result.score >= result.total / 2 ? '🎉' : '📚'}
              </motion.p>
              
              <motion.p 
                className="font-pixel text-2xl text-retro-yellow mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                SCORE: {result.score}/{result.total}
              </motion.p>
              
              <motion.div
                className="flex justify-center items-center gap-2 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.span
                  className="font-pixel text-lg text-retro-green"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.5, repeat: 2 }}
                >
                  +{result.xp_earned} XP
                </motion.span>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5, repeat: 2 }}
                >
                  🪙
                </motion.span>
              </motion.div>
              
              {result.total_xp !== undefined && (
                <motion.p 
                  className="font-pixel text-xs text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  TOTAL XP: {result.total_xp} | LEVEL: {result.level}
                </motion.p>
              )}
              
              {result.score === result.total && (
                <motion.p
                  className="font-pixel text-sm text-retro-cyan mt-3 flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  ⭐ PERFECT SCORE! ⭐
                </motion.p>
              )}
              
              {result.score < result.total / 2 && (
                <motion.p
                  className="font-pixel text-xs text-retro-purple mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  💪 KEEP PRACTICING!
                </motion.p>
              )}
            </motion.div>

            {/* Detailed Result Report */}
            <motion.div 
              className="retro-panel p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="font-pixel text-sm text-retro-cyan mb-4 flex items-center gap-2">
                📋 DETAILED REPORT
                <span className="text-xs text-gray-500">
                  ({result.score} correct, {result.total - result.score} wrong)
                </span>
              </h3>
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
                      transition={{ delay: 0.9 + qi * 0.08 }}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <motion.span 
                          className="text-2xl flex-shrink-0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ delay: 1 + qi * 0.08, type: 'spring' }}
                        >
                          {isCorrect ? '✅' : '❌'}
                        </motion.span>
                        <div className="flex-1">
                          <p className="font-pixel text-[10px] text-retro-cyan/70 mb-1">
                            QUESTION {qi + 1}
                          </p>
                          <p className="font-pixel text-xs text-gray-800 dark:text-gray-200 mb-3">
                            {q.question}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 ml-8">
                        <div className="flex items-center gap-2">
                          <span className="font-pixel text-[10px] text-gray-500 w-32">YOUR ANSWER:</span>
                          <span className={`font-pixel text-xs ${isCorrect ? 'text-retro-green' : 'text-retro-red'}`}>
                            {userAnswer}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="font-pixel text-[10px] text-gray-500 w-32">CORRECT ANSWER:</span>
                            <span className="font-pixel text-xs text-retro-green">
                              {q.answer}
                            </span>
                          </div>
                        )}
                        <motion.div
                          className={`font-pixel text-xs font-bold mt-2 flex items-center gap-2 ${
                            isCorrect ? 'text-retro-green' : 'text-retro-red'
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.1 + qi * 0.08 }}
                        >
                          {isCorrect ? (
                            <>
                              <span>✓ CORRECT</span>
                              <span className="text-[10px]">+{Math.floor(result.xp_earned / result.total)} XP</span>
                            </>
                          ) : (
                            <span>✗ WRONG</span>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Next Topic Button */}
            {nextTopic && onNextTopic && (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y:  0 }}
                transition={{ delay: 1.5 }}
              >
                <motion.button
                  onClick={() => { playClick(); onNextTopic(); }}
                  className="retro-btn bg-retro-cyan text-retro-dark border-cyan-600 text-xs inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>NEXT TOPIC: {nextTopic.title.toUpperCase()}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
