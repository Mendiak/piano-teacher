/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        'white-key': 'var(--white-key)',
        'black-key': 'var(--black-key)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
}
