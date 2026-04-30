import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import type { MatrixColumnContentOverflowValue } from './index.ts';
import type { MultipleColumnMatrix } from './index.ts';
import type { MultipleColumnMatrixProps } from './index.ts';
import { padAround } from './index.ts';
import { padEnd } from './index.ts';
import { padStart } from './index.ts';

export function compileMultipleColumnMatrix<
  TMatrixItem extends Record<string, any>,
>(props: MultipleColumnMatrixProps<TMatrixItem>): MultipleColumnMatrix {
  const gapWidth = props.gap ? stripAnsi(props.gap).length : 0;
  const leftGapWidth = props.leftGap ? stripAnsi(props.leftGap).length : 0;
  const rightGapWidth = props.rightGap ? stripAnsi(props.rightGap).length : 0;
  const matrixWidth = props.width ? Math.max(0, props.width - leftGapWidth - rightGapWidth) : null;

  let matrixPreform = props.columns
    .map((column, columnIndex) => {
      let columnMinContent = 0;
      let columnMaxContent = 0;
      const rows = props.data.map((item) => {
        const text = (column.render ? column.render(item) : column.key ? String(item[column.key]) : null) ?? ``;
        const plainText = stripAnsi(text);
        const minContent = plainText.split(/\s+/).reduce((width, line) => {
          return Math.max(width, line.length);
        }, 0);
        const maxContent = plainText.split(`\n`).reduce((width, line) => {
          return Math.max(width, line.length);
        }, 0);
        columnMinContent = Math.max(columnMinContent, minContent);
        columnMaxContent = Math.max(columnMaxContent, maxContent);
        return { text, minContent, maxContent };
      });

      let width: null | number = null;
      let minWidth: number = 0;
      let maxWidth: number = Infinity;
      let desiredWidth: number;
      let overflow: MatrixColumnContentOverflowValue = `hidden`;
      if (typeof column.width === `number`) {
        width = Math.max(0, column.width);
        minWidth = width;
        maxWidth = width;
        desiredWidth = width;
        overflow = column.contentOverflow ?? overflow;
      }
      else if (column.width === `min-content`) {
        maxWidth = Math.max(columnMinContent, Math.max(0, column.maxWidth ?? Infinity));
        minWidth = Math.min(maxWidth, Math.max(columnMinContent, Math.max(0, column.minWidth ?? 0)));
        desiredWidth = Math.max(minWidth, Math.min(maxWidth, columnMaxContent));
        overflow = `word-wrap`;
      }
      else if (column.width === `max-content`) {
        maxWidth = Math.max(columnMaxContent, Math.max(0, column.maxWidth ?? Infinity));
        minWidth = Math.min(maxWidth, Math.max(columnMaxContent, Math.max(0, column.minWidth ?? 0)));
        desiredWidth = Math.max(minWidth, Math.min(maxWidth, columnMaxContent));
        overflow = `word-wrap`;
      }
      else if (column.width === `fit-content`) {
        maxWidth = Math.max(columnMinContent, Math.min(columnMaxContent, Math.max(0, column.maxWidth ?? Infinity)));
        minWidth = Math.min(maxWidth, Math.max(columnMinContent, Math.min(columnMaxContent, Math.max(0, column.minWidth ?? minWidth))));
        desiredWidth = Math.max(minWidth, Math.min(maxWidth, columnMaxContent));
        overflow = `word-wrap`;
      }
      else if (column.width === `auto`) {
        maxWidth = Math.max(0, column.maxWidth ?? Infinity);
        minWidth = Math.min(maxWidth, Math.max(0, column.minWidth ?? 0));
        desiredWidth = Math.max(minWidth, Math.min(maxWidth, columnMaxContent));
        overflow = column.contentOverflow ?? overflow;
      }
      else {
        width = columnMaxContent;
        minWidth = width;
        maxWidth = width;
        desiredWidth = width;
      }

      return {
        rows,
        width,
        minWidth,
        maxWidth,
        desiredWidth,
        minContent: columnMinContent,
        maxContent: columnMaxContent,
        overflow,
        align: column.contentAlign,
        keepVisible: column.keepVisible,
        columnIndex,
      };
    });

  if (matrixWidth != null) {
    matrixPreform = [...matrixPreform].sort((a, b) => {
      if (a.keepVisible === b.keepVisible) {
        return a.columnIndex - b.columnIndex;
      }
      else {
        return Number(b.keepVisible) - Number(a.keepVisible);
      }
    });


    let filled = false;
    let flexColumnCount = 0;
    let widthAcc = 0;
    let totalFlexColumnsUnallocatedWidth = 0;
    let totalFlexColumnsAllocatedWidth = 0;

    matrixPreform = matrixPreform.filter((column, index) => {
      const gap = index === 0 ? 0 : gapWidth;
      const occupiedWidth = (column.width ?? column.minWidth) + gap;

      if (filled) {
        return false;
      }
      else if (widthAcc + occupiedWidth > matrixWidth) {
        filled = true;
        return false;
      }
      else {
        widthAcc += occupiedWidth;
        if (column.width == null) {
          flexColumnCount ++;
          totalFlexColumnsUnallocatedWidth += Math.max(0, column.desiredWidth - column.minWidth);
          totalFlexColumnsAllocatedWidth += column.minWidth;
        }
        return true;
      }
    });

    matrixPreform = [...matrixPreform].sort((a, b) => {
      if (a.width == null && b.width == null) {
        return a.columnIndex - b.columnIndex;
      }
      else if (a.width === null) {
        return -1;
      }
      else if (b.width === null) {
        return 1;
      }
      else {
        return a.columnIndex - b.columnIndex;
      }
    });

    let allocatedWidth = 0;

    matrixPreform = matrixPreform.map((column) => {
      if (column.width == null) {
        let width;
        if (flexColumnCount === 1) {
          width = column.minWidth + matrixWidth - widthAcc - allocatedWidth;
          allocatedWidth += width - column.minWidth;
        }
        else {
          const handout = totalFlexColumnsUnallocatedWidth
            ? (matrixWidth - widthAcc) / totalFlexColumnsUnallocatedWidth * (column.desiredWidth - column.minWidth)
            : (matrixWidth - widthAcc) / totalFlexColumnsAllocatedWidth * column.minWidth;
          const approximateWidth = column.minWidth + handout;
          width = Math.max(column.minWidth, Math.min(column.maxWidth, Math.round(approximateWidth)));
          allocatedWidth += width - column.minWidth;
        }

        -- flexColumnCount;

        return {
          ...column,
          width,
        };
      }
      else {
        return column;
      }
    });

    matrixPreform = [...matrixPreform].sort((a, b) => {
      return a.columnIndex - b.columnIndex;
    });
  }
  else {
    matrixPreform = matrixPreform.map((column) => {
      return {
        ...column,
        width: column.width ?? column.desiredWidth,
      };
    });
  }

  const rows = Array(props.data.length).fill(null).map((_, rowIndex) => {
    let rowHeight = 0;
    const cells = matrixPreform.map((column) => {
      const rowLines = column.rows[rowIndex].text.split(`\n`)
        .flatMap((rowLine) => {
          if (column.overflow === `word-wrap`) {
            return wrapAnsi(rowLine, column.width!, { hard: true, wordWrap: true }).split(`\n`);
          }
          else if (column.overflow === `hard-wrap`) {
            return wrapAnsi(rowLine, column.width!, { hard: true, wordWrap: false }).split(`\n`);
          }
          else {
            return sliceAnsi(rowLine, 0, column.width!);
          }
        })
        .map((line) => {
          if (column.align === `align-right`) {
            return padStart(line, column.width!);
          }
          else if (column.align === `align-center`) {
            return padAround(line, column.width!);
          }
          else {
            return padEnd(line, column.width!);
          }
        });

      rowHeight = Math.max(rowHeight, rowLines.length);
      return rowLines;
    });

    return Array(rowHeight).fill(null)
      .map((_, lineIndex) => {
        const innerLine = matrixPreform
          .map((column, columnIndex) => {
            return cells[columnIndex][lineIndex] ?? ` `.repeat(column.width!);
          })
          .join(props.gap ?? ``);
        return (props.leftGap ?? ``) + innerLine + (props.rightGap ?? ``);
      });
  });

  const width = matrixPreform.reduce((acc, column) => acc + column.width!, 0)
    + Math.max(0, matrixPreform.length - 1) * gapWidth + leftGapWidth + rightGapWidth;

  return {
    columns: matrixPreform.map((column) => column.width!),
    rows,
    width,
    gap: props.gap ?? ``,
    leftGap: props.leftGap ?? ``,
    rightGap: props.rightGap ?? ``,
  };
}
