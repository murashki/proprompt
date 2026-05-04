import type { TableColumnContentAlign } from './TableColumnContentAlign.ts';
import type { TableColumnContentOverflow } from './TableColumnContentOverflow.ts';
import type { TableColumnRender } from './TableColumnRender.ts';
import type { TableColumnWidth } from './TableColumnWidth.ts';

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
