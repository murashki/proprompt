import type { WaitForKeyHandler } from './WaitForKeyHandler.ts';

export type HandleWaitForKey = {
  (handler: WaitForKeyHandler): Promise<void>;
};
