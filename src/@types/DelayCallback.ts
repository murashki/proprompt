import type { DelayCallbackHandler } from './DelayCallbackHandler.ts';

export type DelayCallback = {
  (control: DelayCallbackHandler): void;
};
