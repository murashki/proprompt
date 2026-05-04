import type { StringifyOpts } from './@types/StringifyOpts.ts';
import { line } from './line.ts';
import { stringify } from './stringify.ts';

export async function dump(value: any, opts?: StringifyOpts) {
  await line(stringify(value, { ...opts, depth: opts?.depth ?? Infinity }));
}
