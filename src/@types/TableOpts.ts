import type { TableColumn } from './index.ts';

export type TableOpts<
  TMatrixItem extends Record<string, any> = Record<string, any>,
> = {
  animate?: boolean;
  columns: TableColumn<TMatrixItem>[];
  data: TMatrixItem[];
  width?: number;
};
