import type { LineOpts } from './@types/LineOpts.ts';
import { write } from './core/writer.ts';
import { lineSplit } from './lineSplit.ts';

export async function line(text?: string, opts?: LineOpts) {
  const { animate, ...restOpts } = opts ?? {};
  const lines = lineSplit(text ?? ``, restOpts);
  await write(lines, animate ?? true);
}
