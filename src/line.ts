import type { LineOpts } from './@types/LineOpts.ts';
import { write } from './core/writer.ts';
import { getLines } from './getLines.ts';

export async function line(text: string, opts?: LineOpts) {
  const { animate, ...restOpts } = opts ?? {};

  const lines = getLines(text, restOpts);
  await write(lines, animate ?? true);
}
