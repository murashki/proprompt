import type { WaitForKeyCallbackHandler } from './index.ts';

export type WaitForKeyCallback = {
  (handler: WaitForKeyCallbackHandler): Promise<void>;
};
