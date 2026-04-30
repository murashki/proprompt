import { compileMultipleColumnMatrix } from '../../index.ts';
import { testMatrix } from './tools/testMatrix.ts';

const getMatrix = () => compileMultipleColumnMatrix({
  columns: [
    {
      render: (item) => item.a,
    },
    {
      render: (item) => item.b,
      width: 3,
    },
    {
      render: (item) => item.c,
      width: 6,
    },
    {
      render: (item) => item.d,
      width: 9,
    },
    {
      render: (item) => item.e,
      width: 12,
    },
  ],
  data: [
    {
      a: `abc`,
      b: `abc`,
      c: `abc`,
      d: `abc`,
      e: `abc`,
    },
    {
      a: `abclmnxyz`,
      b: `abclmnxyz`,
      c: `abclmnxyz`,
      d: `abclmnxyz`,
      e: `abclmnxyz`,
    },
  ],
  gap: ` | `,
});

const result = `
abc       | abc | abc    | abc       | abc         
---------------------------------------------------
abclmnxyz | abc | abclmn | abclmnxyz | abclmnxyz   
`;

await testMatrix(getMatrix, result);
