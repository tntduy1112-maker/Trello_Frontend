/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trello: {
          // Primary
          blue: '#0C66E4',
          'blue-hover': '#0055CC',
          'blue-active': '#09326C',
          navy: '#091E42',
          'navy-2': '#172B4D',
          // Accent
          yellow: '#F5CD47',
          'blue-light': '#85B8FF',
          'blue-pale': '#E9F2FF',
          // Neutrals
          'gray-light': '#F1F2F4',
          'gray-border': '#DCDFE4',
          'gray-medium': '#A9ABAF',
          'gray-dark': '#505258',
          'gray-neutral': '#505F79',
          secondary: '#44546F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'trello-card': 'rgba(9, 30, 66, 0.13) 0px 1px 1px 0px',
        'trello-card-hover': 'rgba(9, 30, 66, 0.25) 0px 4px 8px 0px',
        'trello-btn': 'rgba(9, 30, 66, 0.15) 0px 8px 16px 0px',
        'trello-dropdown': 'rgba(9, 30, 66, 0.25) 0px 4px 8px 0px',
        'trello-modal': 'rgba(9, 30, 66, 0.3) 0px 12px 24px 0px',
        'trello-focus': '0px 0px 0px 2px rgba(12, 102, 228, 0.2)',
      },
      borderRadius: {
        trello: '4px',
        'trello-btn': '4.8px',
        'trello-pill': '50px',
      },
      height: {
        navbar: '60px',
      },
      minHeight: {
        btn: '40px',
      },
    },
  },
  plugins: [],
}
