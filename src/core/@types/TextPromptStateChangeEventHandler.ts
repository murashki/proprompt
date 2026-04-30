import type { TextPromptState } from './TextPromptState.ts';
import type { TextPromptStateChangeReason } from './TextPromptStateChangeReason.ts';
import type { TextPromptStateUpdate } from './TextPromptStateUpdate.ts';

export type TextPromptStateChangeEventHandler = {
  (reason: TextPromptStateChangeReason, state: TextPromptState): void | null | TextPromptStateUpdate;
};
