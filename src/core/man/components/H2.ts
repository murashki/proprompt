import c from 'chalk';
import { compileSingleColumnMatrix } from '../../../index.ts';
import type { H2Element } from './index.ts';
import type { H2Props } from './index.ts';
import { H2_MIN_WIDTH } from './index.ts';

export function H2(props: H2Props): H2Element {
  return {
    type: `h2`,
    content: props.content,
    paddingLeft: props.paddingLeft,
    compile: (width: number) => {
      const safetyWidth = Math.max(H2_MIN_WIDTH, width);
      const paddingLeft = props.paddingLeft ?? 0;

      return compileSingleColumnMatrix({
        lines: [c.underline(props.content)],
        width: safetyWidth,
        contentOverflow: `word-wrap`,
        startWith: ` `.repeat(paddingLeft),
      });
    },
  };
}
