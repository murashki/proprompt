import type { MatrixColumnContentAlignValue } from './MatrixColumnContentAlignValue.ts';
import type { MatrixColumnContentOverflowValue } from './MatrixColumnContentOverflowValue.ts';

export type SingleColumnMatrixProps = {
  lines: string[];
  width?: number;
  contentAlign?: MatrixColumnContentAlignValue;
  contentOverflow?: MatrixColumnContentOverflowValue;
  startWith?: string;
  endWith?: string;
};
