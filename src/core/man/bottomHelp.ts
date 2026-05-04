import c from 'chalk';
import { compileMultipleColumnMatrix } from '../../compileMultipleColumnMatrix.ts';
import { compileSingleColumnMatrix } from '../../compileSingleColumnMatrix.ts';
import * as symbol from '../../symbol.ts';
import { stdout } from '../stdio/index.ts';
import { hotKey } from './components/hotKey.ts';

export const bottomHelp = () => {
  return [
    c.dim(symbol.DIV.repeat(stdout.screen.columns())),
    ...compileMultipleColumnMatrix({
      columns: [
        {
          key: `left`,
          width: `max-content`,
        },
        {
          key: `center`,
          width: `max-content`,
        },
        {
          key: `right`,
        },
      ],
      data: [
        {
          left: `${hotKey(`Up`, true)}    Scroll up`,
          center: `${hotKey(`Left`, true)}   Page up`,
          right: `${hotKey(`Shift + Left`, true)}   Jump to top`,
        },
        {
          left: `${hotKey(`Down`, true)}  Scroll down`,
          center: `${hotKey(`Right`, true)}  Page down`,
          right: `${hotKey(`Shift + Right`, true)}  Jump to bottom`,
        },
      ],
      width: stdout.screen.columns(),
      gap: `  `,
      leftGap: `  `,
      rightGap: `  `,
    }).rows.flat(),
    compileSingleColumnMatrix({
      lines: [`${hotKey(`Q`, true)} or ${hotKey(`Esc`, true)}  Quit help`],
      startWith: `  `,
      endWith: `  `,
      width: stdout.screen.columns(),
    }),
  ];
};
