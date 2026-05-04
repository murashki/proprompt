import type { StringifyOpts } from './index.ts';
import { line } from './index.ts';
import { stringify } from './index.ts';

export async function dump(value: any, opts?: StringifyOpts) {
  await line(stringify(value, { ...opts, depth: opts?.depth ?? Infinity }));
}
