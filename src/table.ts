import c from 'chalk';
import stripAnsi from 'strip-ansi';
import type { MultipleColumnMatrixColumn } from './index.ts';
import type { TableProps } from './index.ts';
import { compileMultipleColumnMatrix } from './index.ts';
import { padEnd } from './index.ts';
import { symbol } from './index.ts';
import { write } from './index.ts';

export async function table<
  TMatrixItem extends Record<string, any> = Record<string, any>,
>(props: TableProps<TMatrixItem>) {
  const { animate, columns, ...propsRest } = props;

  const matrixColumns: MultipleColumnMatrixColumn<TMatrixItem>[] = columns.map((column) => {
    if (typeof column.width === `number`) {
      return column;
    }
    else {
      const titleWidth = stripAnsi(column.title).length;

      return {
        ...column,
        minWidth: column.minWidth ? Math.max(column.minWidth, titleWidth) : titleWidth,
        maxWidth: column.maxWidth ? Math.max(column.maxWidth, titleWidth) : column.maxWidth,
        width: column.width ?? `auto`,
      };
    }
  });

  const matrix = compileMultipleColumnMatrix({
    ...propsRest,
    columns: matrixColumns,
    gap: ` ` + b(symbol.TABLE_BORDER.L1010) + ` `,
    leftGap: b(symbol.TABLE_BORDER.L1010) + ` `,
    rightGap: ` ` + b(symbol.TABLE_BORDER.L1010),
  });

  const topLine = b(``
    + symbol.TABLE_BORDER.L0110
    + matrix.columns
      .map((column) => {
        return symbol.TABLE_BORDER.L0101.repeat(column + 2);
      })
      .join(symbol.TABLE_BORDER.L0111)
    + symbol.TABLE_BORDER.L0011
  );

  const joinLine = b(``
    + symbol.TABLE_BORDER.L1110
    + matrix.columns
      .map((column) => {
        return symbol.TABLE_BORDER.L0101.repeat(column + 2);
      })
      .join(symbol.TABLE_BORDER.L1111)
    + symbol.TABLE_BORDER.L1011
  );

  const bottomLine = b(``
    + symbol.TABLE_BORDER.L1100
    + matrix.columns
      .map((column) => {
        return symbol.TABLE_BORDER.L0101.repeat(column + 2);
      })
      .join(symbol.TABLE_BORDER.L1101)
    + symbol.TABLE_BORDER.L1001
  );

  const headLine = ``
    + b(symbol.TABLE_BORDER.L1010)
    + ` `
    + columns
      .map((column, index) => {
        return padEnd(c.cyan(column.title), matrix.columns[index]);
      })
      .join(` ` + b(symbol.TABLE_BORDER.L1010) + ` `)
    + ` `
    + b(symbol.TABLE_BORDER.L1010);

  const lines = matrix.rows
    .map((rowLines) => rowLines.join(`\n`))
    .join(`\n${joinLine}\n`)
    .split(`\n`);

  await write([
    topLine,
    headLine,
    joinLine,
    ...lines,
    bottomLine,
  ], animate);
}

// Table borders style
function b(border: string) {
  return c.dim.gray(border);
}
