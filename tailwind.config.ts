import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './layouts/**/*.{ts,tsx}',
    './motion/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ── Colors ─────────────────────────────────────────
      // All values reference CSS custom properties from styles/tokens.css.
      // Change the token value once — every Tailwind class updates.
      colors: {
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
        north: {
          text: 'var(--text)',
          'text-2': 'var(--text-2)',
          muted: 'var(--muted)',
          subtle: 'var(--subtle)',
          accent: 'var(--accent)',
          'accent-warm': 'var(--accent-warm)',
          'accent-dim': 'var(--accent-dim)',
        },
        glow: {
          accent: 'var(--glow-accent)',
          warm: 'var(--glow-warm)',
        },
      },

      // ── Typography ──────────────────────────────────────
      fontFamily: {
        display: ['var(--font-manrope)', ...fontFamily.sans],
        body: ['var(--font-manrope)', ...fontFamily.sans],
        mono: ['var(--font-ibm-plex-mono)', ...fontFamily.mono],
      },
      fontSize: {
        '2xs': ['var(--text-xs)', { lineHeight: 'var(--leading-snug)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        md: ['var(--text-md)', { lineHeight: 'var(--leading-normal)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-snug)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-snug)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],
        '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-tight)' }],
        '7xl': ['var(--text-7xl)', { lineHeight: 'var(--leading-tight)' }],
        display: [
          'var(--text-6xl)',
          { lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tight)' },
        ],
        'display-xl': [
          'var(--text-7xl)',
          { lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tight)' },
        ],
      },
      lineHeight: {
        tight: 'var(--leading-tight)',
        snug: 'var(--leading-snug)',
        normal: 'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
      },
      letterSpacing: {
        tighter: 'var(--tracking-tight)',
        tight: 'var(--tracking-snug)',
        normal: 'var(--tracking-normal)',
        wide: 'var(--tracking-wide)',
        widest: 'var(--tracking-widest)',
      },

      // ── Radius ─────────────────────────────────────────
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      // ── Motion ─────────────────────────────────────────
      transitionDuration: {
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        cinematic: 'var(--duration-cinematic)',
      },
      transitionTimingFunction: {
        smooth: 'var(--ease-smooth)',
        cinematic: 'var(--ease-cinematic)',
        swift: 'var(--ease-swift)',
        reveal: 'var(--ease-reveal)',
        spring: 'var(--ease-spring)',
      },

      // ── Z-index ────────────────────────────────────────
      zIndex: {
        raised: '10',
        float: '20',
        overlay: '30',
        modal: '40',
        toast: '50',
        cursor: '100',
      },

      // ── Keyframes + Animations ─────────────────────────
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'reveal-up': {
          from: { clipPath: 'inset(100% 0 0 0)' },
          to: { clipPath: 'inset(0% 0 0 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        breath: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in':
          'fade-in var(--duration-normal) var(--ease-cinematic) both',
        'fade-up':
          'fade-up var(--duration-slow) var(--ease-cinematic) both',
        'fade-down':
          'fade-down var(--duration-slow) var(--ease-cinematic) both',
        'reveal-up':
          'reveal-up var(--duration-cinematic) var(--ease-reveal) both',
        shimmer: 'shimmer 3s ease-in-out infinite',
        breath: 'breath 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
        'cursor-blink': 'cursor-blink 1.1s step-start infinite',
      },
    },
  },
  plugins: [],
}

export default config
