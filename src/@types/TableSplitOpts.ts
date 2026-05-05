import type { TableColumn } from './TableColumn.ts';

export type TableSplitOpts<
  TTableItem extends Record<string, any> = Record<string, any>,
> = {
  columns: TableColumn<TTableItem>[];
  data: TTableItem[];
  width?: number;
};
