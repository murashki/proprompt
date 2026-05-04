import type { TableColumn } from './TableColumn.ts';

export type TableOpts<
  TMatrixItem extends Record<string, any> = Record<string, any>,
> = {
  animate?: boolean;
  columns: TableColumn<TMatrixItem>[];
  data: TMatrixItem[];
  width?: number;
};
