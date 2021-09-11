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
    extend: {
      zIndex: {
        '-1': -1,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        99: 99, // right before
        101: 101, // right above header
        102: 102, // right above header
        103: 103, // right above header
      },
      height: {
        '50vh': '50vh',
      },
      minHeight: {
        '50vh': '50vh',
      },
      maxHeight: {
        '50vh': '50vh',
      },
      width: {
        '50vw': '50vw',
      },
      maxWidth: {
        '50vw': '50vw',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};
