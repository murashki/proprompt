import c from 'chalk';
import { compileSingleColumnMatrix } from '../../../compileSingleColumnMatrix.ts';
import type { H2Element } from './@types/H2Element.ts';
import type { H2Opts } from './@types/H2Opts.ts';
import { H2_MIN_WIDTH } from './constants.ts';

export function H2(opts: H2Opts): H2Element {
  return {
    type: `h2`,
    content: opts.content,
    paddingLeft: opts.paddingLeft,
    compile: (width: number) => {
      const safetyWidth = Math.max(H2_MIN_WIDTH, width);
      const paddingLeft = opts.paddingLeft ?? 0;

      return compileSingleColumnMatrix({
        lines: [c.underline(opts.content)],
        width: safetyWidth,
        contentOverflow: `word-wrap`,
        startWith: ` `.repeat(paddingLeft),
      });
    },
  };
}
