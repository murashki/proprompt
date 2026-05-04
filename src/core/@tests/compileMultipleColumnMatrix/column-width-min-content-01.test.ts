import { compileMultipleColumnMatrix } from '../../../compileMultipleColumnMatrix.ts';
import { testMatrix } from './tools/testMatrix.ts';

const getMatrix = () => compileMultipleColumnMatrix({
  columns: [
    {
      render: (item) => item.left,
      width: `min-content`,
    },
    {
      render: (item) => item.center,
      width: `min-content`,
    },
    {
      render: (item) => item.right,
    },
  ],
  data: [
    {
      left: `Line one - abc`,
      center: `Line one - 123xyz`,
      right: `Line one - abc 123 xyz`,
    },
    {
      left: `Line two - a`,
      center: `Line two - b`,
      right: `Line two - c`,
    },
  ],
  gap: ` | `,
  width: 70,
});

const result = `
Line one - abc      | Line one - 123xyz       | Line one - abc 123 xyz
----------------------------------------------------------------------
Line two - a        | Line two - b            | Line two - c          
`;

await testMatrix(getMatrix, result);
