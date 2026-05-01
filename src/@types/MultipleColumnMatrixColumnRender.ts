export type MultipleColumnMatrixColumnRender<
  TMatrixItem extends Record<string, any>,
> = {
  (
    item: TMatrixItem,
  ): undefined | null | string;
};
