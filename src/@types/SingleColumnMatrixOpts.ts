import type { MatrixColumnContentAlign } from './MatrixColumnContentAlign.ts';
import type { MatrixColumnContentOverflow } from './MatrixColumnContentOverflow.ts';

export type SingleColumnMatrixOpts = {
  lines: string[];
  width?: number;
  contentAlign?: MatrixColumnContentAlign;
  contentOverflow?: MatrixColumnContentOverflow;
  startWith?: string;
  endWith?: string;
};
