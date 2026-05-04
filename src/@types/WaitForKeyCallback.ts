import type { WaitForKeyCallbackHandler } from './WaitForKeyCallbackHandler.ts';

export type WaitForKeyCallback = {
  (handler: WaitForKeyCallbackHandler): Promise<void>;
};
