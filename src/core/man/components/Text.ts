import { compileSingleColumnMatrix } from '../../../compileSingleColumnMatrix.ts';
import type { TextElement } from './@types/TextElement.ts';
import type { TextOpts } from './@types/TextOpts.ts';
import { TEXT_MIN_WIDTH } from './constants.ts';

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
