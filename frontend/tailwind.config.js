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
          // Bright retro palette
          skyBlue: '#87CEEB',
          grassGreen: '#90EE90',
          softYellow: '#FFE66D',
          warmSand: '#F4D06F',
          lightCream: '#FFF8DC',
          orangeAccent: '#FF8C42',
          
          // Complementary colors
          dark: '#2C3E50',
          darker: '#1A252F',
          purple: '#9B7EDE',
          blue: '#5DADE2',
          cyan: '#00E5FF',
          yellow: '#FFD700',
          red: '#FF6B6B',
          green: '#4ECB71',
          pink: '#FF85B3',
          orange: '#FF8800',
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
