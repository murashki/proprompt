import { compileMultipleColumnMatrix } from '../../../compileMultipleColumnMatrix.ts';
import { testMatrix } from './tools/testMatrix.ts';

const getMatrix = () => compileMultipleColumnMatrix({
  columns: [
    {
      render: (item) => item.a,
    },
    {
      render: (item) => item.b,
    },
    {
      render: (item) => item.c,
    },
    {
      render: (item) => item.d,
    },
  ],
  data: [
    {
      a: `abc lmn xyz`,
      b: `abc lmn xyz`,
      c: `abc lmn xyz`,
      d: `abc lmn xyz`,
    },
    {
      a: `abc`,
      b: `abc`,
      c: `abc`,
      d: `abc`,
    },
  ],
  gap: ` | `,
  width: 10,
});

const result = `

`;

await testMatrix(getMatrix, result);
