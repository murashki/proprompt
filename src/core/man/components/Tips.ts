import { compileMultipleColumnMatrix } from '../../../index.ts';
import { symbol } from '../../../index.ts';
import type { TipsElement } from './index.ts';
import type { TipsProps } from './index.ts';
import { TIPS_MIN_WIDTH } from './index.ts';

export function Tips(props: TipsProps): TipsElement {
  return {
    type: `tips`,
    list: props.list,
    paddingLeft: props.paddingLeft,
    compile: (width: number) => {
      const safetyWidth = Math.max(TIPS_MIN_WIDTH, width);

      const matrix = compileMultipleColumnMatrix({
        columns: [
          {
            render: () => {
              return symbol.TIP;
            },
          },
          {
            key: `text`,
            width: `auto`,
            contentOverflow: `word-wrap`,
          },
        ],
        data: props.list.map((text) => {
          return { text };
        }),
        gap: `  `,
        leftGap: ` `.repeat(props.paddingLeft ?? 0),
        width: safetyWidth,
      });

      return matrix.rows.flat();
    },
  };
}
