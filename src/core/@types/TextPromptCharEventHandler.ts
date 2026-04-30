import type { TextPromptState } from './TextPromptState.ts';
import type { TextPromptStateUpdate } from './TextPromptStateUpdate.ts';

export type TextPromptCharEventHandler = {
  (char: string, state: TextPromptState): void | null | TextPromptStateUpdate;
};
