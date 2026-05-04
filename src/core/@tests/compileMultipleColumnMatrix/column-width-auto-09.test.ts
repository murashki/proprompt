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
    {
      render: (item) => item.d,
      width: `auto`,
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
      a: `abcd`,
      b: `abcd`,
      c: `abcd`,
      d: `abcd`,
    },
  ],
  gap: ` | `,
  width: 54,
});

const result = `
abc lmn xyz | abc lmn xyz | abc lmn xyz | abc lmn xyz 
------------------------------------------------------
abcd        | abcd        | abcd        | abcd        
`;

await testMatrix(getMatrix, result);
