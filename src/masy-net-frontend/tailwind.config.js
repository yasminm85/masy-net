/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        richBlack: "#030014",
        cyberGrape: "#4a24a6",
        darkIndigo: "#1B0032",
        charcoalGray: "#20232A",
        gunMetal: "#2A3439",
        whiteSmoke: "#F5F5F5",
        silverGray: "#C0C0C0",
        coolGray: "#A0A0A0",
        dimGray: "#696969",
        neonCyan: "#00FFFF",
        electricPurple: "#BF00FF",
        mintGreen: "#00FFB2",
        hotPink: "#FF007F",
        acidGreen: "#B0FF00",

      },

      animation: {
        'gradient-xy': 'gradientXY 10s ease-in-out infinite',
      },
      keyframes: {
        gradientXY: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-20%, -10%)' },
        },
      },
      
    },
  },
  plugins: [],
}