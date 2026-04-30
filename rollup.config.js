const typescript = require('@rollup/plugin-typescript');

module.exports = [
  {
    input: [
      './src/index.ts',
    ],
    output: [
      {
        dir: './dist',
        entryFileNames: 'cjs/[name].cjs.js',
        format: 'cjs',
      },
      {
        dir: './dist',
        entryFileNames: 'esm/[name].esm.js',
        format: 'esm',
      },
    ],
    plugins: [
      typescript(
        {
          tsconfig: './tsconfig.json',
        },
      ),
    ],
  },
];
