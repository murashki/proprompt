import type { HandleDelay } from './@types/HandleDelay.ts';
import type { DelayHandler } from './@types/DelayHandler.ts';

export function delay(ms: number, fn?: HandleDelay) {
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

    const handler: DelayHandler = {
      resolve: tryResolve,
      resolved: false,
      onResolve: null,
    };

    timeout = setTimeout(tryResolve, ms);
    fn?.(handler);
  });
}
