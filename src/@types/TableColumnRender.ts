export type TableColumnRender<
  TMatrixItem extends Record<string, any> = Record<string, any>,
> = {
  (item: TMatrixItem): string;
};
