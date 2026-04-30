import type { TextPromptState } from './TextPromptState.ts';
import type { TextPromptStateUpdate } from './TextPromptStateUpdate.ts';

export type TextPromptDataEventHandler = {
  (data: Buffer, state: TextPromptState): void | null | TextPromptStateUpdate;
};
