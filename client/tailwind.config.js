module.exports = {
  purge: {
    enabled: true,
    content: [
      './projects/data/src/**/*.{html,ts}',
      './projects/sys/src/**/*.{html,ts}',
      './projects/public/src/**/*.{html,ts}',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
