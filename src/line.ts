import type { LineProps } from './index.ts';
import { getLines } from './index.ts';
import { write } from './index.ts';

export async function line(text: string, props?: LineProps) {
  const { animate, ...restProps } = props ?? {};

  const lines = getLines(text, restProps);
  await write(lines, animate ?? true);
}
