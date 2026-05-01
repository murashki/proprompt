import { compileMultipleColumnMatrix } from '../../../index.ts';
import { testMatrix } from './tools/testMatrix.ts';

const getMatrix = () => compileMultipleColumnMatrix({
  columns: [
    {
      render: (item) => item.a,
    },
    {
      render: (item) => item.b,
      contentAlign: `align-left`,
    },
    {
      render: (item) => item.c,
      contentAlign: `align-center`,
    },
    {
      render: (item) => item.d,
      contentAlign: `align-right`,
    },
  ],
  data: [
    {
      a: `abc`,
      b: `abc`,
      c: `abc`,
      d: `abc`,
    },
    {
      a: `abclmnxyz`,
      b: `abclmnxyz`,
      c: `abclmnxyz`,
      d: `abclmnxyz`,
    },
  ],
  gap: ` | `,
});

const result = `
abc       | abc       |    abc    |       abc
---------------------------------------------
abclmnxyz | abclmnxyz | abclmnxyz | abclmnxyz
`;

await testMatrix(getMatrix, result);
