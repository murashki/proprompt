import c from 'chalk';
import stripAnsi from 'strip-ansi';
import type { MultipleColumnMatrixColumn } from './@types/MultipleColumnMatrixColumn.ts';
import type { TableSplitOpts } from './@types/TableSplitOpts.ts';
import { padEnd } from './core/tools/padEnd.ts';
import { compileMultipleColumnMatrix } from './compileMultipleColumnMatrix.ts';
import * as symbol from './symbol.ts';

export function tableSplit<
  TTableItem extends Record<string, any> = Record<string, any>,
>(opts: TableSplitOpts<TTableItem>): string[] {
  const { columns, ...optsRest } = opts;

  const matrixColumns: MultipleColumnMatrixColumn<TTableItem>[] = columns.map((column) => {
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
    ...optsRest,
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

  return [
    topLine,
    headLine,
    joinLine,
    ...lines,
    bottomLine,
  ];
}

// Table borders style
function b(border: string) {
  return c.dim.gray(border);
}
