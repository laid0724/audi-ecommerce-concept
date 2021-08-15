module.exports = {
  purge: {
    enabled: false,
    content: [
      './projects/data/src/**/*.{html,ts}',
      './projects/sys/src/**/*.{html,ts}',
      './projects/public/src/**/*.{html,ts}',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
