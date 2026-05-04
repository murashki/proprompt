import c from 'chalk';
import { compileSingleColumnMatrix } from '../../../index.ts';
import type { H1Element } from './index.ts';
import type { H1Opts } from './index.ts';
import { H1_MIN_WIDTH } from './index.ts';

export function H1(opts: H1Opts): H1Element {
  return {
    type: `h1`,
    content: opts.content,
    paddingLeft: opts.paddingLeft,
    compile: (width: number) => {
      const safetyWidth = Math.max(H1_MIN_WIDTH, width);
      const paddingLeft = opts.paddingLeft ?? 0;

      return compileSingleColumnMatrix({
        lines: [c.cyan(opts.content)],
        width: safetyWidth,
        contentOverflow: `word-wrap`,
        startWith: ` `.repeat(paddingLeft),
      });
    },
  };
}
