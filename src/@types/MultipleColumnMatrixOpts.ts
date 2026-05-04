import type { MultipleColumnMatrixColumn } from './MultipleColumnMatrixColumn.ts';

export type MultipleColumnMatrixOpts<
  TMatrixItem extends Record<string, any>,
> = {
  columns: MultipleColumnMatrixColumn<TMatrixItem>[];
  data: TMatrixItem[];
  gap?: string;
  leftGap?: string;
  rightGap?: string;
  width?: number;
};
