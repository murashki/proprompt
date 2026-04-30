import type { TextPromptCharEventHandler } from './TextPromptCharEventHandler.ts';
import type { TextPromptDataEventHandler } from './TextPromptDataEventHandler.ts';
import type { TextPromptEventName } from './TextPromptEventName.ts';
import type { TextPromptKeypressEventHandler } from './TextPromptKeypressEventHandler.ts';
import type { TextPromptStateChangeEventHandler } from './TextPromptStateChangeEventHandler.ts';
import type { TextPromptStateUpdate } from './TextPromptStateUpdate.ts';

export type TextPromptListener = {
  on: {
    (event: Extract<TextPromptEventName, `statechange`>, handler: TextPromptStateChangeEventHandler): void;
    (event: Extract<TextPromptEventName, `data`>, handler: TextPromptDataEventHandler): void;
    (event: Extract<TextPromptEventName, `keypress`>, handler: TextPromptKeypressEventHandler): void;
    (event: Extract<TextPromptEventName, `char`>, handler: TextPromptCharEventHandler): void;
  },
  push: (stateUpdate: TextPromptStateUpdate) => void;
  listen: (stateUpdate?: null | TextPromptStateUpdate, paused?: boolean) => void;
  pause: (stateUpdate?: null | TextPromptStateUpdate) => void;
  resume: (stateUpdate?: null | TextPromptStateUpdate) => void;
  end: () => void;
};
