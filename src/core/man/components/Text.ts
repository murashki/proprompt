import { compileSingleColumnMatrix } from '../../../index.ts';
import type { TextElement } from './index.ts';
import type { TextOpts } from './index.ts';
import { TEXT_MIN_WIDTH } from './index.ts';

export function Text(opts: TextOpts): TextElement {
  return {
    type: `text`,
    content: opts.content,
    paddingLeft: opts.paddingLeft,
    compile: (width: number) => {
      const safetyWidth = Math.max(TEXT_MIN_WIDTH, width);
      const paddingLeft = opts.paddingLeft ?? 0;

      return compileSingleColumnMatrix({
        lines: [opts.content],
        width: safetyWidth,
        contentOverflow: `word-wrap`,
        startWith: ` `.repeat(paddingLeft),
      });
    },
  };
}
