import type { LineOverflow } from './LineOverflow.ts';
import type { LineStyle } from './LineStyle.ts';

export type LineSplitOpts = {
  as?: null | LineStyle;
  bar?: null | string;
  hardReturnSymbol?: boolean | string;
  marker?: null | string;
  overflow?: LineOverflow;
};
