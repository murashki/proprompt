import type { MessageOpts } from './index.ts';
import { line } from './index.ts';

export async function message(text: string, opts?: MessageOpts) {
  await line(`${text}\n`, opts);
}
