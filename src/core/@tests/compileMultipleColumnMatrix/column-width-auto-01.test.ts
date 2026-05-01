import { compileMultipleColumnMatrix } from '../../../index.ts';
import { testMatrix } from './tools/testMatrix.ts';

const getMatrix = () => compileMultipleColumnMatrix({
  columns: [
    {
      render: (item) => item.a,
    },
    {
      render: (item) => item.b,
      width: `auto`,
    },
  ],
  data: [
    {
      a: `abc lmn xyz`,
      b: `abc lmn xyz`,
      c: `abc lmn xyz`,
    },
    {
      a: `abcd`,
      b: `abcd`,
      c: `abcd`,
    },
  ],
  gap: ` | `,
  width: 25,
});

const result = `
abc lmn xyz | abc lmn xyz
-------------------------
abcd        | abcd       
`;

await testMatrix(getMatrix, result);
