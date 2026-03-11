import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { playClick } from '../utils/sounds';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hey there, adventurer! 🎮 I\'m your AI Tutor. Ask me anything about coding!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('General');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    playClick();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: text, topic: currentTopic });
      setMessages((prev) => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Oops! Something went wrong. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-retro-cyan border-2 border-cyan-400 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={!open ? { y: [0, -6, 0] } : {}}
        transition={!open ? { duration: 2, repeat: Infinity } : {}}
        title="AI Tutor"
      >
        {open ? '✖' : '🤖'}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-retro-darker border-2 border-retro-cyan/50 flex flex-col shadow-xl shadow-cyan-500/10"
            style={{ maxHeight: '70vh' }}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
          >
            {/* Header */}
            <div className="bg-gray-100 dark:bg-retro-dark border-b border-retro-cyan/30 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-pixel text-xs text-retro-cyan">🤖 AI TUTOR</p>
                <p className="font-pixel text-xs text-gray-600 dark:text-gray-500">ASK ME ANYTHING</p>
              </div>
              <input
                type="text"
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                className="bg-white dark:bg-retro-darker border border-gray-300 dark:border-gray-700 font-pixel text-xs text-gray-600 dark:text-gray-400 px-2 py-1 w-24 focus:border-retro-cyan/50 focus:outline-none"
                placeholder="Topic..."
                title="Set topic context"
              />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: '200px', maxHeight: '50vh' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 font-pixel text-xs leading-5 ${
                      msg.role === 'user'
                        ? 'bg-retro-cyan/20 border border-retro-cyan/30 text-cyan-800 dark:text-cyan-200'
                        : 'bg-retro-purple/20 border border-retro-purple/30 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-retro-purple/20 border border-retro-purple/30 px-3 py-2">
                    <motion.span
                      className="font-pixel text-xs text-gray-600 dark:text-gray-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      THINKING...
                    </motion.span>
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="border-t border-retro-cyan/30 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-white dark:bg-retro-darker border border-gray-300 dark:border-gray-700 font-pixel text-xs text-gray-800 dark:text-gray-200 px-3 py-2 focus:border-retro-cyan focus:outline-none"
                placeholder="Ask a question..."
                disabled={loading}
              />
              <motion.button
                onClick={sendMessage}
                className="bg-retro-cyan border-2 border-cyan-400 px-3 py-2 font-pixel text-xs text-retro-dark"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !input.trim()}
              >
                SEND
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
