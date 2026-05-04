import { compileMultipleColumnMatrix } from '../../../index.ts';
import type { DescriptionListElement } from './index.ts';
import type { DescriptionListOpts } from './index.ts';
import { DESCRIPTION_LIST_MIN_WIDTH } from './index.ts';

export function DescriptionList(opts: DescriptionListOpts): DescriptionListElement {
  return {
    type: `description-list`,
    list: opts.list,
    paddingLeft: opts.paddingLeft,
    compile: (width: number) => {
      const safetyWidth = Math.max(DESCRIPTION_LIST_MIN_WIDTH, width);

      const matrix = compileMultipleColumnMatrix({
        columns: [
          {
            key: `term`,
          },
          {
            key: `details`,
            width: `auto`,
            contentOverflow: `word-wrap`,
          },
        ],
        data: opts.list,
        gap: `    `,
        leftGap: ` `.repeat(opts.paddingLeft ?? 0),
        width: safetyWidth,
      });

      return matrix.rows.flat();
    },
  };
}
