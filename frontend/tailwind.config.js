/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        retro: {
          dark: '#0a0a2e',
          darker: '#050520',
          purple: '#1a1a4e',
          blue: '#1e3a5f',
          cyan: '#00e5ff',
          yellow: '#ffd700',
          red: '#ff4444',
          green: '#00ff88',
          pink: '#ff66aa',
          orange: '#ff8800',
        },
      },
      animation: {
        'pixel-float': 'pixelFloat 3s ease-in-out infinite',
        'pixel-blink': 'pixelBlink 1s steps(2) infinite',
        'pixel-bounce': 'pixelBounce 0.6s steps(4) infinite',
      },
      keyframes: {
        pixelFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pixelBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pixelBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
