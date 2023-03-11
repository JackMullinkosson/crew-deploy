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
      'bg-purple-500',
      'hover:bg-purple-700',
      'border-purple-500',
      'hover:border-purple-700',
      'ml-4',
      'ml-8'
    ]
  },
}
