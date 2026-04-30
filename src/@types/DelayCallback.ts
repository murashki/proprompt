import type { DelayCallbackHandler } from './index.ts';

export type DelayCallback = {
  (control: DelayCallbackHandler): void;
};
