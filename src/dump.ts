import type { StringifyProps } from './index.ts';
import { line } from './index.ts';
import { stringify } from './index.ts';

export async function dump(value: any, props?: StringifyProps) {
  await line(stringify(value, { ...props, depth: props?.depth ?? Infinity }));
}
