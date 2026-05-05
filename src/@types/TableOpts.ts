import type { TableSplitOpts } from './TableSplitOpts.ts';

export type TableOpts<
  TTableItem extends Record<string, any> = Record<string, any>,
> = TableSplitOpts<TTableItem> & {
  animate?: boolean;
};
