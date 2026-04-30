import c from 'chalk';
import { message } from './index.ts';

export async function terminate(text?: string) {
  await message(c.red(text ?? `Terminated`), { marker: ` `, bar: ` ` });
}
