/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-main': '#082CAE',
        'custom-hover': '#0B237B',
        'custom-error': '#FF4A4D',
        'custom-error-dark': '#E63E41',
        'custom-correct': '#339114',
        'custom-orange': '#FFA72B',
        'custom-gold': '#FFE981',
        'custom-gold-dark': '#d9bc30',
        'custom-blue': '#EDF3FA',
        'custom-blue-dark': '#D8E6F4',
        'custom-input': '#7C98FF',
        'custom-input-fill': '#F6F6F6',
        'custom-input-text': '#AFAFAF',
        'custom-dark-bg': '#0A1028',
        'custom-dark': '#252F57',
        'custom-black': '#1C1C1C',
        'custom-inactive': '#EFF1F3',
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      animation: {
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        aurora: "aurora 25s linear infinite",
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        rainbow: {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card-1': '3.9px 15.59px 23.39px 0px rgba(0, 0, 0, 0.12)',
        'card-2': '1.95px 5.84px 19.47px 0px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [
    ({ addBase, theme }) => {
      function flattenColors(colors, prefix = "") {
        let entries = Object.entries(colors).flatMap(([key, val]) => {
          if (typeof val === "object" && val !== null) {
            return Object.entries(flattenColors(val, `${prefix}${key}-`));
          }
          return [[`${prefix}${key}`, val]];
        });
        return Object.fromEntries(entries);
      }

      let allColors = flattenColors(theme("colors"));
      let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
      );

      addBase({
        ":root": newVars,
      });
    }
  ],
}
