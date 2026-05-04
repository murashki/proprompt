import { compileMultipleColumnMatrix } from '../../../compileMultipleColumnMatrix.ts';
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
    {
      render: (item) => item.c,
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
  width: 36,
});

const result = `
abc lmn xyz | abc lmn xy | abc lmn x
------------------------------------
abcd        | abcd       | abcd     
`;

await testMatrix(getMatrix, result);
