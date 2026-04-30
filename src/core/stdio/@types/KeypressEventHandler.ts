import type { Key } from 'node:readline';

export type KeypressEventHandler = {
  (char: undefined | string, key: Key): void;
};
