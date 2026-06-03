/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "secondary-fixed": "#e1e0ff",
        "tertiary-container": "#c584d2",
        "on-primary": "#00344d",
        "error-container": "#93000a",
        "surface-container-lowest": "#070d1f",
        "surface-variant": "#2e3447",
        "primary-fixed": "#c9e6ff",
        "error": "#ffb4ab",
        "surface-container-high": "#23293c",
        "on-tertiary-fixed-variant": "#682f76",
        "on-background": "#dce1fb",
        "surface-dim": "#0c1324",
        "surface-container-low": "#151b2d",
        "on-tertiary-fixed": "#340042",
        "primary": "#89ceff",
        "on-error": "#690005",
        "outline-variant": "#3e4850",
        "on-secondary-fixed": "#07006c",
        "surface-container-highest": "#2e3447",
        "surface-container": "#191f31",
        "on-primary-fixed-variant": "#004c6e",
        "on-surface-variant": "#bec8d2",
        "primary-fixed-dim": "#89ceff",
        "primary-container": "#0ea5e9",
        "on-secondary": "#1000a9",
        "tertiary-fixed": "#fcd6ff",
        "background": "#0c1324",
        "outline": "#88929b",
        "tertiary-fixed-dim": "#f3aeff",
        "surface": "#0c1324",
        "on-surface": "#dce1fb",
        "inverse-on-surface": "#2a3043",
        "on-tertiary-container": "#521961",
        "secondary": "#c0c1ff",
        "on-error-container": "#ffdad6",
        "secondary-fixed-dim": "#c0c1ff",
        "secondary-container": "#3131c0",
        "on-secondary-fixed-variant": "#2f2ebe",
        "inverse-primary": "#006591",
        "on-secondary-container": "#b0b2ff",
        "surface-tint": "#89ceff",
        "tertiary": "#f3aeff",
        "inverse-surface": "#dce1fb",
        "on-tertiary": "#4e155d",
        "on-primary-fixed": "#001e2f",
        "on-primary-container": "#003751",
        "surface-bright": "#33394c"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "container-max": "1280px",
        "margin-mobile": "16px",
        "margin-desktop": "48px",
        "base": "8px",
        "gutter": "24px"
      },
      "fontFamily": {
        "headline-md": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"],
        "body-lg": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"]
      },
      "fontSize": {
        "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "display-lg-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}]
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
