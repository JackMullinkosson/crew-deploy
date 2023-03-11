/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  purge: {
    content:  [
      './src/**/*.html',
      './src/**/*.ts',
      './src/**/*.tsx',
    ],
    safelist: [
      {
        pattern: /./,
        variants: ['sm', 'md', 'lg', 'xl', '2xl'], 
      },
    ]
  },
}
