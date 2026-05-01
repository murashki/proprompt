import { expect } from 'vitest';
import { test } from 'vitest';
import type { MultipleColumnMatrix } from '../../../../index.ts';

function getLines(getMatrix: () => MultipleColumnMatrix) {
  const matrix = getMatrix();
  const div = `-`.repeat(matrix.width);
  return matrix.rows
    .flatMap((lines, index) => {
      return index === 0 ? lines : [div, ...lines];
    });
}

export async function testMatrix(getMatrix: () => MultipleColumnMatrix, expectedResult: string) {
  test(`matrix`, () => {
    const expectedLines = expectedResult.split(`\n`);
    expectedLines.shift();
    expectedLines.pop();
    const lines = getLines(getMatrix);
    expect(lines).toStrictEqual(expectedLines);
  });
}
