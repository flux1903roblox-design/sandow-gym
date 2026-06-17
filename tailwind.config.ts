import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0B0D',
        surface: '#16181D',
        'surface-2': '#1F2228',
        'surface-3': '#272A32',
        border: '#26282F',
        foreground: '#F4F5F7',
        muted: '#8A8F98',
        'muted-2': '#5E636E',
        primary: { DEFAULT: '#FF6A2B', fg: '#0A0B0D', soft: '#2A1A11' },
        secondary: { DEFAULT: '#3B82F6', fg: '#FFFFFF', soft: '#10203A' },
        success: { DEFAULT: '#22C55E', fg: '#05140A' },
        warning: '#FBBF24',
        destructive: '#EF4444',
      },
      fontFamily: {
        sans: ['Heebo', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Heebo', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.75rem',
        '4xl': '2rem',
      },
      spacing: {
        'safe-t': 'env(safe-area-inset-top)',
        'safe-b': 'env(safe-area-inset-bottom)',
        'safe-l': 'env(safe-area-inset-left)',
        'safe-r': 'env(safe-area-inset-right)',
      },
      maxWidth: {
        phone: '440px',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        glow: '0 8px 32px -8px rgba(255,106,43,0.45)',
        'glow-blue': '0 8px 32px -8px rgba(59,130,246,0.45)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.1)', opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-ring': 'pulse-ring 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
