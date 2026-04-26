/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Shadcn UI base colors (can be mapped later if needed)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Material 3 / Generated Design System
        "primary-container": "#1e3a8a",
        "on-tertiary": "#ffffff",
        "primary-fixed-dim": "#b6c4ff",
        "surface": "#faf8ff",
        "secondary-container": "#fea619",
        "error-container": "#ffdad6",
        "on-secondary-fixed-variant": "#653e00",
        "surface-container": "#eeedf4",
        "on-primary-fixed": "#00164e",
        "on-error-container": "#93000a",
        "on-tertiary-container": "#f39461",
        "on-background": "#1a1b21",
        "inverse-surface": "#2f3036",
        "secondary-fixed-dim": "#ffb95f",
        "surface-variant": "#e3e1e9",
        "tertiary-container": "#6e2c00",
        "on-error": "#ffffff",
        "error": "#ba1a1a",
        "on-secondary-fixed": "#2a1700",
        "surface-bright": "#faf8ff",
        "on-secondary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f3fa",
        "inverse-primary": "#b6c4ff",
        "primary-fixed": "#dce1ff",
        "on-surface-variant": "#444651",
        "surface-tint": "#4059aa",
        "surface-container-highest": "#e3e1e9",
        "outline-variant": "#c5c5d3",
        "on-primary-container": "#90a8ff",
        "on-primary": "#ffffff",
        "tertiary": "#4b1c00",
        "surface-dim": "#dad9e1",
        "tertiary-fixed": "#ffdbcb",
        "surface-container-high": "#e9e7ef",
        "secondary-fixed": "#ffddb8",
        "on-surface": "#1a1b21",
        "tertiary-fixed-dim": "#ffb691",
        "on-tertiary-fixed-variant": "#773205",
        "on-tertiary-fixed": "#341100",
        "on-primary-fixed-variant": "#264191",
        "outline": "#757682",
        "on-secondary-container": "#684000",
        "inverse-on-surface": "#f1f0f7"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "2xl": "48px",
        "sm": "8px",
        "base": "8px",
        "3xl": "64px",
        "xl": "32px",
        "lg": "24px",
        "xs": "4px",
        "md": "16px"
      },
      fontFamily: {
        "body-reading": ["Newsreader"],
        "h2-editorial": ["Newsreader"],
        "ui-header": ["Inter"],
        "ui-label": ["Inter"],
        "ui-body": ["Inter"],
        "h1-editorial": ["Newsreader"]
      },
      fontSize: {
        "body-reading": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "h2-editorial": ["32px", { lineHeight: "1.3", fontWeight: "500" }],
        "ui-header": ["16px", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "ui-label": ["12px", { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "500" }],
        "ui-body": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "h1-editorial": ["48px", { lineHeight: "1.2", fontWeight: "600" }]
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
