/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic background aliases */
        bg: "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "bg-tertiary": "var(--color-bg-tertiary)",
        "bg-elevated": "var(--color-bg-elevated)",
        "bg-surface": "var(--color-bg-surface)",
        /* Legacy background aliases */
        dark: "var(--color-bg-primary)",
        "dark-secondary": "var(--color-bg-secondary)",
        "dark-tertiary": "var(--color-bg-tertiary)",
        "dark-elevated": "var(--color-bg-elevated)",
        /* Foreground colors */
        fg: "var(--color-fg-primary)",
        "fg-secondary": "var(--color-fg-secondary)",
        "fg-tertiary": "var(--color-fg-tertiary)",
        "fg-muted": "var(--color-fg-muted)",
        "fg-faint": "var(--color-fg-faint)",
        /* Accent colors */
        accent: "var(--color-accent-primary)",
        "accent-secondary": "var(--color-accent-secondary)",
        "accent-tertiary": "var(--color-accent-tertiary)",
        "accent-warm": "var(--color-accent-warm)",
        "accent-warm-light": "var(--color-accent-warm-light)",
        "accent-dim": "var(--color-accent-dim)",
        /* Glass */
        "glass-bg": "var(--glass-bg)",
        "glass-border": "var(--glass-border)",
        /* Status colors */
        success: "var(--color-status-success)",
        warning: "var(--color-status-warning)",
        error: "var(--color-status-error)",
      },
      borderColor: {
        DEFAULT: "var(--color-border-primary)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(-10px)" },
          "60%": { opacity: "1", transform: "scale(1.05) translateY(4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        fadeSlide: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shineGold: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "300% center" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        orbFloat: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(30px, -20px) scale(1.05)" },
          "50%": { transform: "translate(-20px, 15px) scale(0.95)" },
          "75%": { transform: "translate(15px, 25px) scale(1.02)" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        textReveal: {
          "0%": { clipPath: "inset(0 100% 0 0)", opacity: "0" },
          "100%": { clipPath: "inset(0 0 0 0)", opacity: "1" },
        },
        gridDrift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "48px 48px" },
        },
        orbBreath: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.65" },
        },
        noisePulse: {
          "0%, 100%": { opacity: "0.03" },
          "50%": { opacity: "0.05" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out forwards",
        bounceIn: "bounceIn 0.5s ease-out forwards",
        fadeSlide: "fadeSlide 0.3s ease forwards",
        shineGold: "shineGold 4.6s linear infinite",
        shimmer: "shimmer 3s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        orbFloat: "orbFloat 20s ease-in-out infinite",
        gradientShift: "gradientShift 8s ease infinite",
        glowPulse: "glowPulse 4s ease-in-out infinite",
        textReveal: "textReveal 0.8s ease-out forwards",
        gridDrift: "gridDrift 20s linear infinite",
      },
      fontFamily: {
        sans: [
          "var(--font-plus-jakarta)",
          "Plus Jakarta Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--font-syne)",
          "Syne",
          "Plus Jakarta Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      container: {
        center: true,
        padding: "1rem",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "350ms",
      },
      zIndex: {
        dropdown: "10",
        sticky: "20",
        fixed: "30",
        "modal-backdrop": "40",
        modal: "50",
        popover: "60",
        tooltip: "70",
      },
      backdropBlur: {
        glass: "16px",
        "glass-strong": "24px",
      },
      boxShadow: {
        glow: "var(--glow-cyan)",
        "glow-sm": "var(--glow-cyan-sm)",
        "glow-violet": "var(--glow-violet)",
        "glow-green": "var(--glow-green)",
        "glow-warm": "var(--glow-warm)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
