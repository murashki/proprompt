import c from 'chalk';
import { message } from './index.ts';
import { symbol } from './index.ts';

export async function intro(text: string) {
  await message(c.bgCyan(c.black(` ${text} `)), { marker: symbol.INTRO, bar: symbol.BAR });
}
