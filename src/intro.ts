import c from 'chalk';
import type { IntroProps } from './index.ts';
import { message } from './index.ts';
import { symbol } from './index.ts';

export async function intro(text: string, props?: IntroProps) {
  let styledText = ``;
  switch (props?.as) {
    case `warning`: {
      styledText = c.bgYellow(c.black(` ${text} `));
      break;
    }
    case `danger`: {
      styledText = c.bgRed(c.black(` ${text} `));
      break;
    }
    case `success`: {
      styledText = c.bgGreen(c.black(` ${text} `));
      break;
    }
    default: {
      styledText = c.bgCyan(c.black(` ${text} `));
    }
  }

  await message(styledText, { marker: symbol.INTRO, bar: symbol.BAR });
}
