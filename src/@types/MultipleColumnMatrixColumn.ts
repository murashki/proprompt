import type { MatrixColumnContentAlign } from './MatrixColumnContentAlign.ts';
import type { MatrixColumnContentOverflow } from './MatrixColumnContentOverflow.ts';
import type { MatrixColumnWidth } from './MatrixColumnWidth.ts';
import type { MultipleColumnMatrixColumnRender } from './MultipleColumnMatrixColumnRender.ts';

/*
  If the `width` property is set to a number, then the width will equal the specified value. The
  `minWidth` and `maxWidth` properties are ignored in this case. The `contentOverflow` property is
  applied, with its default value being `hidden`.

  Note that properties `minWidth` and `maxWidth` take effect only when property `width` is set to
  `min-content`, `max-content`, `fit-content`, or `auto`. More details below.

  If the `width` property equals `min-content`, then the minimum column width will be such that the
  element's content doesn't overflow and is displayed without truncation but with soft wrapping.
  Essentially, the minimum possible width in this case equals the width of either the longest word
  or the widest indivisible element. The `minWidth` and `maxWidth` properties are applied if they're
  greater than minimum column width. The `contentOverflow` property is ignored, but content wrapping
  in the column works as if `word-wrap` was specified.

  If the `width` property equals `max-content`, then the minimum column width will be such that the
  element's content doesn't overflow and is displayed without wrapping or truncation. Essentially,
  the minimum possible width in this case is the width that the content would occupy if it could use
  infinite space. The `minWidth` and `maxWidth` properties are applied if they're greater than
  column minimum width. The `contentOverflow` property is ignored because no content wrapping in the
  column is needed.

  If the `width` property equals `fit-content`, then the column width will range from `min-content`
  to `max-content`. The `minWidth` and `maxWidth` properties are applied if they're specified within
  these limits. The `contentOverflow` property is ignored, but content wrapping in the column works
  as if `word-wrap` was specified.

  If the `width` property equals `auto`, then the column width can be any size. The `minWidth` and
  `maxWidth` properties are applied. The `contentOverflow` property is also applied, with its
  default value being `hidden`.

  If the `width` property isn't specified, then the column width will be such that the element's
  content doesn't overflow and is displayed without wrapping or truncation. Essentially, this is the
  width that the content would occupy if it could use infinite space. The `minWidth` and `maxWidth`
  properties are ignored. The `contentOverflow` property is also ignored because no content wrapping
  in the column is needed.
 */

export type MultipleColumnMatrixColumn<
  TMatrixItem extends Record<string, any>,
> = {
  key?: keyof TMatrixItem,
  render?: MultipleColumnMatrixColumnRender<TMatrixItem>;
  width?: MatrixColumnWidth;
  minWidth?: number;
  maxWidth?: number;
  contentAlign?: MatrixColumnContentAlign;
  contentOverflow?: MatrixColumnContentOverflow;
  keepVisible?: boolean;
};
