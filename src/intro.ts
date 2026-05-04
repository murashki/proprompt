import c from 'chalk';
import type { IntroOpts } from './@types/IntroOpts.ts';
import { message } from './message.ts';
import * as symbol from './symbol.ts';

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
