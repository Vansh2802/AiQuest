import { motion } from 'framer-motion';

export default function ExplanationPanel({ explanation, loading }) {
  // Parse markdown-like formatting into styled sections
  const renderExplanation = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-3" />;
      // ## Heading
      if (trimmed.startsWith('## ')) {
        return <h2 key={i} className="font-pixel text-retro-yellow text-xl md:text-2xl mb-3 mt-5">{trimmed.replace('## ', '')}</h2>;
      }
      // **Bold line** (full line bold)
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <p key={i} className="font-pixel text-retro-cyan text-base md:text-lg mb-2 mt-4">{trimmed.replace(/\*\*/g, '')}</p>;
      }
      // Bold prefix: **Label:** rest
      if (trimmed.startsWith('**') && trimmed.includes(':**')) {
        const match = trimmed.match(/^\*\*(.+?):\*\*\s*(.*)/);
        if (match) {
          return <p key={i} className="text-gray-800 dark:text-gray-200 text-base md:text-lg leading-8 mb-1"><span className="font-pixel text-retro-cyan text-sm">{match[1]}:</span> {match[2]}</p>;
        }
      }
      // Code block markers
      if (trimmed.startsWith('```')) {
        return null; // handled by treating lines between ``` as code
      }
      // Numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        return <p key={i} className="text-gray-800 dark:text-gray-200 text-base md:text-lg leading-8 mb-1 pl-4">{trimmed}</p>;
      }
      // Bullet points
      if (trimmed.startsWith('- ')) {
        return <p key={i} className="text-gray-800 dark:text-gray-200 text-base md:text-lg leading-8 mb-1 pl-4">• {trimmed.slice(2)}</p>;
      }
      // Italic tip
      if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
        return <p key={i} className="text-gray-600 dark:text-gray-500 text-sm italic mt-4">{trimmed.replace(/^\*|\*$/g, '')}</p>;
      }
      // Regular text
      return <p key={i} className="text-gray-800 dark:text-gray-200 text-base md:text-lg leading-8 mb-1">{trimmed}</p>;
    });
  };

  // Extract code blocks for special rendering
  const renderWithCodeBlocks = (text) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const code = part.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
        return (
          <pre key={i} className="bg-black/60 border border-retro-green/30 p-4 my-4 overflow-x-auto">
            <code className="font-mono text-retro-green text-sm leading-7">{code}</code>
          </pre>
        );
      }
      return <div key={i}>{renderExplanation(part)}</div>;
    });
  };

  return (
    <motion.div
      className="retro-panel p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <h3 className="font-pixel text-lg text-retro-yellow mb-6">💡 EXPLANATION</h3>

      {loading ? (
        <div className="flex items-center gap-3">
          <motion.span
            className="font-pixel text-retro-cyan text-xs"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            AI IS THINKING...
          </motion.span>
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            ⚙️
          </motion.span>
        </div>
      ) : (
        <div className="bg-white/30 dark:bg-retro-darker/50 border border-gray-300 dark:border-retro-cyan/20 p-6 max-w-[800px] mx-auto">
          {renderWithCodeBlocks(explanation)}
        </div>
      )}
    </motion.div>
  );
}
