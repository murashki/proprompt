import c from 'chalk';
import { message } from './message.ts';

export async function terminate(text?: string) {
  await message(c.red(text ?? `Terminated`), { marker: ` `, bar: ` ` });
}
