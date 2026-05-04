// npx tsx --tsconfig ./tsconfig.json ./src/ecosystem/tools/prompts/core/stdio/playground/pressAnyKey.ts

import type { Key } from 'node:readline';
import { inspect } from 'node:util';
import { withResolvers } from '../../tools/withResolvers.ts';
import { stdin } from '../index.ts';
import { stdout } from '../index.ts';

export async function pressAnyKey() {
  const { promise, resolve } = withResolvers();

  const onData = (data: Buffer) => {
    const key = data.toString();

    console.log(`onData`, { key });

    // Ctrl + C
    if (key === stdin.key.ctrlC) {
      resolve();
    }
  };

  const onKeypress = (char: undefined | string, key: Key) => {
    console.log(`onKeypress`, { char, key, isCommonChar: getCommonChar(key.sequence) != null });
  };

  const listener = stdin.createListener();
  listener.on(`data`, onData);
  listener.on(`keypress`, onKeypress);
  listener.listen();

  stdin.setRawMode(true);
  stdin.resume();
  stdout.cursor.hide();

  await promise;

  listener.end();
  stdout.cursor.show();
  stdin.pause();
  stdin.setRawMode(false);
}

await pressAnyKey();

export function getCommonChar(key?: string) {
  return key === `\\\\` ? `\\` : !! key && inspect(key, { depth: null, colors: false }).length === 3 ? key : null;
}
