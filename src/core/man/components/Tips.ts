import { compileMultipleColumnMatrix } from '../../../compileMultipleColumnMatrix.ts';
import * as symbol from '../../../symbol.ts';
import type { TipsElement } from './@types/TipsElement.ts';
import type { TipsOpts } from './@types/TipsOpts.ts';
import { TIPS_MIN_WIDTH } from './constants.ts';

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
        data: opts.list.map((text) => ({ text })),
        gap: `  `,
        leftGap: ` `.repeat(opts.paddingLeft ?? 0),
        width: safetyWidth,
      });

      return matrix.rows.flat();
    },
  };
}
