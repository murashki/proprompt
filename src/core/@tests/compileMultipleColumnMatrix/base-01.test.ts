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
      a: `Line one\nLine two\nLine three`,
      b: `Line one\nLine two`,
      c: `Line one`,
      d: ``,
    },
    {
      a: `Line one\nLine two`,
      b: `Line one`,
      c: ``,
      d: `Line one\nLine two\nLine three`,
    },
    {
      a: `Line one`,
      b: ``,
      c: `Line one\nLine two\nLine three`,
      d: `Line one\nLine two`,
    },
    {
      a: ``,
      b: `Line one\nLine two\nLine three`,
      c: `Line one\nLine two`,
      d: `Line one`,
    },
  ],
  gap: ` | `,
});

const result = `
Line one   | Line one   | Line one   |           
Line two   | Line two   |            |           
Line three |            |            |           
-------------------------------------------------
Line one   | Line one   |            | Line one  
Line two   |            |            | Line two  
           |            |            | Line three
-------------------------------------------------
Line one   |            | Line one   | Line one  
           |            | Line two   | Line two  
           |            | Line three |           
-------------------------------------------------
           | Line one   | Line one   | Line one  
           | Line two   | Line two   |           
           | Line three |            |           
`;

await testMatrix(getMatrix, result);
