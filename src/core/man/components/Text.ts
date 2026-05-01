import { compileSingleColumnMatrix } from '../../../index.ts';
import type { TextElement } from './index.ts';
import type { TextProps } from './index.ts';
import { TEXT_MIN_WIDTH } from './index.ts';

export function Text(props: TextProps): TextElement {
  return {
    type: `text`,
    content: props.content,
    paddingLeft: props.paddingLeft,
    compile: (width: number) => {
      const safetyWidth = Math.max(TEXT_MIN_WIDTH, width);
      const paddingLeft = props.paddingLeft ?? 0;

      return compileSingleColumnMatrix({
        lines: [props.content],
        width: safetyWidth,
        contentOverflow: `word-wrap`,
        startWith: ` `.repeat(paddingLeft),
      });
    },
  };
}
