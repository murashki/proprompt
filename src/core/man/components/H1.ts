import c from 'chalk';
import { compileSingleColumnMatrix } from '../../../index.ts';
import type { H1Element } from './index.ts';
import type { H1Props } from './index.ts';
import { H1_MIN_WIDTH } from './index.ts';

export function H1(props: H1Props): H1Element {
  return {
    type: `h1`,
    content: props.content,
    paddingLeft: props.paddingLeft,
    compile: (width: number) => {
      const safetyWidth = Math.max(H1_MIN_WIDTH, width);
      const paddingLeft = props.paddingLeft ?? 0;

      return compileSingleColumnMatrix({
        lines: [c.cyan(props.content)],
        width: safetyWidth,
        contentOverflow: `word-wrap`,
        startWith: ` `.repeat(paddingLeft),
      });
    },
  };
}
