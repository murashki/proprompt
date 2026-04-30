import c from 'chalk';
import { message } from './index.ts';

export async function cancel(text?: string) {
  await message(c.yellow(text ?? `Canceled`), { marker: ` `, bar: ` ` });
}
