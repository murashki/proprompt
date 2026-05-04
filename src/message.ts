import type { MessageOpts } from './@types/MessageOpts.ts';
import { line } from './line.ts';

export async function message(text: string, opts?: MessageOpts) {
  await line(`${text}\n`, opts);
}
