import { compileMultipleColumnMatrix } from '../../../compileMultipleColumnMatrix.ts';
import { testMatrix } from './tools/testMatrix.ts';

const getMatrix = () => compileMultipleColumnMatrix({
  columns: [
    {
      render: (item) => item.a,
      width: 9,
    },
    {
      render: (item) => item.b,
      width: 9,
      contentOverflow: `hidden`
    },
    {
      render: (item) => item.c,
      width: 9,
      contentOverflow: `hard-wrap`
    },
    {
      render: (item) => item.d,
      width: 9,
      contentOverflow: `word-wrap`
    },
  ],
  data: [
    {
      a: `abc lmn xyz abclmnxyz123`,
      b: `abc lmn xyz abclmnxyz123`,
      c: `abc lmn xyz abclmnxyz123`,
      d: `abc lmn xyz abclmnxyz123`,
    },
  ],
  gap: ` | `,
});

const result = `
abc lmn x | abc lmn x | abc lmn x | abc lmn  
          |           | yz abclmn | xyz abclm
          |           | xyz123    | nxyz123  
`;

await testMatrix(getMatrix, result);
