import type { LineStyle } from './index.ts';
import type { LineOverflow } from './index.ts';

export type GetLinesOpts = {
  as?: null | LineStyle;
  bar?: null | string;
  hardReturnSymbol?: boolean | string;
  marker?: null | string;
  overflow?: LineOverflow;
};
