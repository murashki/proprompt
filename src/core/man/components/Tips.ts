import { compileMultipleColumnMatrix } from '../../../index.ts';
import { symbol } from '../../../index.ts';
import type { TipsElement } from './index.ts';
import type { TipsOpts } from './index.ts';
import { TIPS_MIN_WIDTH } from './index.ts';

export function Tips(opts: TipsOpts): TipsElement {
  return {
    type: `tips`,
    list: opts.list,
    paddingLeft: opts.paddingLeft,
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
        data: opts.list.map((text) => {
          return { text };
        }),
        gap: `  `,
        leftGap: ` `.repeat(opts.paddingLeft ?? 0),
        width: safetyWidth,
      });

      return matrix.rows.flat();
    },
  };
}
