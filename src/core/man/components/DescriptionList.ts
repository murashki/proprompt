import { compileMultipleColumnMatrix } from '../../index.ts';
import type { DescriptionListElement } from './index.ts';
import type { DescriptionListProps } from './index.ts';
import { DESCRIPTION_LIST_MIN_WIDTH } from './index.ts';

export function DescriptionList(props: DescriptionListProps): DescriptionListElement {
  return {
    type: `description-list`,
    list: props.list,
    paddingLeft: props.paddingLeft,
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
        data: props.list,
        gap: `    `,
        leftGap: ` `.repeat(props.paddingLeft ?? 0),
        width: safetyWidth,
      });

      return matrix.rows.flat();
    },
  };
}
