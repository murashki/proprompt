import type { LineOpts } from './index.ts';
import { getLines } from './index.ts';
import { write } from './index.ts';

export async function line(text: string, opts?: LineOpts) {
  const { animate, ...restOpts } = opts ?? {};

  const lines = getLines(text, restOpts);
  await write(lines, animate ?? true);
}
