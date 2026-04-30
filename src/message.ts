import type { MessageProps } from './index.ts';
import { line } from './index.ts';

export async function message(text: string, props?: MessageProps) {
  await line(`${text}\n`, props);
}
