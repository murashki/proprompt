import type { Key } from 'node:readline';
import type { TextPromptState } from './TextPromptState.ts';
import type { TextPromptStateUpdate } from './TextPromptStateUpdate.ts';

export type TextPromptKeypressEventHandler = {
  (char: undefined | string, key: Key, state: TextPromptState): void | null | TextPromptStateUpdate;
};
