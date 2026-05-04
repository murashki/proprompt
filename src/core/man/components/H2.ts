import c from 'chalk';
import { compileSingleColumnMatrix } from '../../../index.ts';
import type { H2Element } from './index.ts';
import type { H2Opts } from './index.ts';
import { H2_MIN_WIDTH } from './index.ts';

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
