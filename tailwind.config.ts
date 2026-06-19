import type { Config } from 'tailwindcss'

/**
 * Colors map onto the Cal.com semantic tokens in `tokens.css` (light grayscale,
 * black brand). The app's existing class names stay the same (bg-bg, bg-surface,
 * text-foreground, bg-primary, …) so re-theming happens here, once, for the whole app.
 * `<alpha-value>` keeps opacity utilities (bg-bg/70) working.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // page vs card: subtle gray page, white cards (separated by borders — Cal.com way)
        bg: 'hsl(var(--cal-bg-subtle) / <alpha-value>)',
        surface: 'hsl(var(--cal-bg) / <alpha-value>)',
        'surface-2': 'hsl(var(--cal-bg-muted) / <alpha-value>)',
        'surface-3': 'hsl(var(--cal-bg-emphasis) / <alpha-value>)',
        border: 'hsl(var(--cal-border) / <alpha-value>)',
        foreground: 'hsl(var(--cal-text-emphasis) / <alpha-value>)',
        muted: 'hsl(var(--cal-text-subtle) / <alpha-value>)',
        'muted-2': 'hsl(var(--cal-text-muted) / <alpha-value>)',
        // single black primary action per view
        primary: {
          DEFAULT: 'hsl(var(--cal-brand) / <alpha-value>)',
          fg: 'hsl(var(--cal-brand-text) / <alpha-value>)',
          soft: 'hsl(var(--cal-bg-muted) / <alpha-value>)',
        },
        // blue kept as "info" only, used sparingly (e.g. rest timer)
        secondary: {
          DEFAULT: 'hsl(var(--cal-info) / <alpha-value>)',
          fg: '#ffffff',
          soft: 'hsl(var(--cal-bg-muted) / <alpha-value>)',
        },
        success: { DEFAULT: 'hsl(var(--cal-success) / <alpha-value>)', fg: '#ffffff' },
        warning: 'hsl(var(--cal-attention) / <alpha-value>)',
        destructive: 'hsl(var(--cal-error) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Heebo', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Heebo', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Cal.com uses a consistent small radius everywhere — cap the big steps.
        xl: '0.5rem',
        '2xl': '0.5rem',
        '3xl': '0.625rem',
        card: '0.5rem',
        '4xl': '0.625rem',
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
        // borders over shadows — keep everything subtle
        card: '0 1px 2px 0 rgb(16 24 40 / 0.04)',
        glow: '0 1px 2px 0 rgb(16 24 40 / 0.06)',
        'glow-blue': '0 1px 2px 0 rgb(16 24 40 / 0.06)',
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
