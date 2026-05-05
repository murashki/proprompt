import type { DelayHandler } from './DelayHandler.ts';

export type HandleDelay = {
  (control: DelayHandler): void;
};
