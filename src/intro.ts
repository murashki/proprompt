import c from 'chalk';
import type { IntroOpts } from './index.ts';
import { message } from './index.ts';
import { symbol } from './index.ts';

export async function intro(text: string, opts?: IntroOpts) {
  let styledText = ``;
  switch (opts?.as) {
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
