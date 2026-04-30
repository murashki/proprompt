import type { StringifyProps } from './index.ts';
import { stringify } from './index.ts';
import { line } from './index.ts';

export async function dump(proc: any, props?: StringifyProps) {
  await line(stringify(proc, { ...props, depth: props?.depth ?? Infinity }));
}
