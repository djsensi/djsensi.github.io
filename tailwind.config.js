// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         'bg-dark': '#202023',
//         'card-light': 'rgba(255, 255, 255, 0.08)',

//         // ⭐ Craftzdog light theme beige
//         'craft-light': '#f0e7db',

//         // Accent color
//         accent: '#f7768e'
//       }
//     }
//   },
//   plugins: []
// }
// // tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       fontFamily: {
//         // Wrap the font name in quotes because of the spaces
//         sensi: ['"Gang of Three"', 'sans-serif'], 
//       },
//     },
//   },
// }
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#202023',
        'card-light': 'rgba(255, 255, 255, 0.08)',
        'craft-light': '#f0e7db',
        accent: '#f7768e'
      },
      fontFamily: {
        // You can now use className="font-sensi"
        sensi: ['"Gang of Three"', 'sans-serif'], 
      },
    }
  },
  plugins: []
}