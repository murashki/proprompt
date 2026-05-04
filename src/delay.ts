import type { DelayCallback } from './@types/DelayCallback.ts';
import type { DelayCallbackHandler } from './@types/DelayCallbackHandler.ts';

export function delay(ms: number, fn?: DelayCallback) {
  return new Promise<void>((resolve) => {
    let timeout: null | NodeJS.Timeout = null;

    const tryResolve = () => {
      timeout && (clearTimeout(timeout), (timeout = null));
      if ( ! handler.resolved) {
        handler.resolved = true;
        handler.onResolve?.();
        resolve();
      }
    };

    const handler: DelayCallbackHandler = {
      resolve: tryResolve,
      resolved: false,
      onResolve: null,
    };

    timeout = setTimeout(tryResolve, ms);
    fn?.(handler);
  });
}
