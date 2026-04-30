import type { TableColumn } from './index.ts';

export type TableProps<
  TMatrixItem extends Record<string, any> = Record<string, any>,
> = {
  animate?: boolean;
  columns: TableColumn<TMatrixItem>[];
  data: TMatrixItem[];
  width?: number;
};
