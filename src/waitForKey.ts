import { stdin } from './index.ts';
import type { WaitForKeyCallback } from './index.ts';
import type { WaitForKeyCallbackHandler } from './index.ts';

export async function waitForKey(keys: string[], fn: WaitForKeyCallback): Promise<null | string> {
  const listener = stdin.createListener();

  listener.on(`data`, (data: Buffer) => {
    const key = data.toString();

    if (keys.includes(key)) {
      resolve(key);
    }
  });

  const resolve = (key?: string) => {
    handler.resolved = true;
    handler.resolvedKey = key ?? null;
    handler.onResolve?.(key ?? null);
    listener.end();
  };

  const handler: WaitForKeyCallbackHandler = {
    resolve,
    resolved: false,
    resolvedKey: null,
    onResolve: null,
  };

  listener.listen();

  await fn(handler);

  if ( ! handler.resolved) {
    resolve();
  }

  return handler.resolvedKey;
}
