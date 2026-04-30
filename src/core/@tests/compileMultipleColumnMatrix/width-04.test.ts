import { compileMultipleColumnMatrix } from '../../index.ts';
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
  width: 38,
});

const result = `
abc lmn xyz | abc lmn xyz
-------------------------
abc         | abc        
`;

await testMatrix(getMatrix, result);
