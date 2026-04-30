import type { TableColumnContentAlign } from './index.ts';
import type { TableColumnContentOverflow } from './index.ts';
import type { TableColumnRender } from './index.ts';
import type { TableColumnWidth } from './index.ts';

export type TableColumn<
  TMatrixItem extends Record<string, any> = Record<string, any>,
> = {
  contentAlign?: TableColumnContentAlign;
  contentOverflow?: TableColumnContentOverflow;
  keepVisible?: boolean;
  key?: keyof TMatrixItem,
  maxWidth?: number;
  minWidth?: number;
  render?: TableColumnRender<TMatrixItem>;
  title: string;
  width?: TableColumnWidth;
};
