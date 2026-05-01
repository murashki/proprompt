import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: [
      './src/index.ts',
    ],
    output: [
      {
        dir: './dist',
        entryFileNames: 'cjs/[name].cjs',
        format: 'cjs',
      },
      {
        dir: './dist',
        entryFileNames: 'esm/[name].js',
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
