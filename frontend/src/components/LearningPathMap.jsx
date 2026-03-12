import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LevelNode from './LevelNode';
import PlayerMarker from './PlayerMarker';
import { useEffect, useState } from 'react';

export default function LearningPathMap({ topics, currentTopic }) {
  const navigate = useNavigate();
  const [playerPosition, setPlayerPosition] = useState({ x: 10, y: 50 });

  // Define the curved path positions
  const pathPositions = [
    { x: 10, y: 50 },
    { x: 20, y: 40 },
    { x: 30, y: 35 },
    { x: 40, y: 40 },
    { x: 50, y: 50 },
    { x: 60, y: 60 },
    { x: 70, y: 55 },
    { x: 80, y: 45 },
    { x: 90, y: 50 },
  ];

  // Calculate player position based on completed topics
  useEffect(() => {
    const completedCount = topics.filter(t => t.completed).length;
    if (completedCount < pathPositions.length) {
      setPlayerPosition(pathPositions[completedCount]);
    }
  }, [topics]);

  const handleNodeClick = (topic) => {
    navigate(`/study?topic=${encodeURIComponent(topic.title)}`);
  };

  const getNodeStatus = (topic, index) => {
    if (topic.completed) return 'completed';
    
    // Check if all previous topics are completed
    const previousTopics = topics.slice(0, index);
    const allPreviousCompleted = previousTopics.every(t => t.completed);
    
    if (index === 0 || allPreviousCompleted) return 'unlocked';
    return 'locked';
  };

  return (
    <motion.div
      className="relative w-full bg-gradient-to-b from-retro-skyBlue via-retro-lightCream to-retro-grassGreen rounded-lg border-4 border-retro-dark overflow-hidden"
      style={{ minHeight: '400px' }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Sky decoration */}
      <div className="absolute top-4 left-8">
        <motion.span
          className="text-4xl"
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☁️
        </motion.span>
      </div>
      <div className="absolute top-8 right-16">
        <motion.span
          className="text-3xl"
          animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          ☁️
        </motion.span>
      </div>

      {/* Sun */}
      <motion.div
        className="absolute top-6 right-8 w-16 h-16 bg-retro-softYellow rounded-full border-4 border-retro-orangeAccent"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-retro-orangeAccent opacity-30"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Floating coins */}
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${15 + i * 15}%`,
            top: '15%',
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        >
          🪙
        </motion.span>
      ))}

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <motion.h2
          className="font-pixel text-sm text-retro-dark bg-retro-lightCream px-4 py-2 border-4 border-retro-dark"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          🗺️ LEARNING PATH
        </motion.h2>
      </div>

      {/* Path container */}
      <div className="relative w-full h-full pt-20 pb-8 px-8">
        {/* Draw path background */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        >
          <motion.path
            d={`M ${pathPositions.map((p, i) => 
              `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`
            ).join(' ')}`}
            fill="none"
            stroke="#F4D06F"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          <motion.path
            d={`M ${pathPositions.map((p, i) => 
              `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`
            ).join(' ')}`}
            fill="none"
            stroke="#2C3E50"
            strokeWidth="4"
            strokeDasharray="8 8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, strokeDashoffset: 100 }}
            animate={{ pathLength: 1, strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </svg>

        {/* Level nodes */}
        <div className="relative" style={{ zIndex: 2 }}>
          {topics.slice(0, pathPositions.length).map((topic, index) => (
            <LevelNode
              key={topic.id || topic.title}
              topic={topic}
              status={getNodeStatus(topic, index)}
              position={pathPositions[index]}
              onClick={handleNodeClick}
              isActive={currentTopic === topic.title}
            />
          ))}
        </div>

        {/* Player marker */}
        <PlayerMarker position={playerPosition} />

        {/* Grass decoration at bottom */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-around">
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{
                duration: 1.5 + i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            >
              🌱
            </motion.span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 border-2 border-retro-dark p-2 rounded">
        <div className="flex gap-3 font-pixel text-[8px]">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-retro-green border border-green-600 rounded-full"></span>
            <span>Done</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-retro-softYellow border border-yellow-600 rounded-full"></span>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-400 border border-gray-600 rounded-full"></span>
            <span>Locked</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
