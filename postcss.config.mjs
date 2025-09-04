const config = {
    plugins: {
      "@tailwindcss/postcss": {},
      ...(process.env.NODE_ENV === 'production' && {
        cssnano: {
          preset: ['default', {
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: true,
            minifySelectors: true,
            minifyParams: true,
            minifyFontValues: true,
            minifyGradients: true,
            minifyTimingFunctions: true,
            minifyBorderRadius: true,
            minifyBoxShadow: true,
            minifyTransforms: true,
            minifySelectors: true,
            mergeLonghand: true,
            mergeRules: true,
            normalizeUrl: true,
            normalizeDisplayValues: true,
            normalizePositions: true,
            normalizeRepeatStyle: true,
            normalizeString: true,
            normalizeUnicode: true,
            normalizeWhitespace: true,
            orderedValues: true,
            reduceIdents: true,
            reduceInitial: true,
            reduceTransforms: true,
            svgo: true,
            uniqueSelectors: true,
            zindex: true,
          }],
        },
      }),
    },
  };
  export default config;