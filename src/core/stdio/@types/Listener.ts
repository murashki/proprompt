import type { EventName } from './index.ts';
import type { DataEventHandler } from './index.ts';
import type { EndEventHandler } from './index.ts';
import type { KeypressEventHandler } from './index.ts';

export type Listener = {
  on: {
    (event: Extract<EventName, `data`>, handler: DataEventHandler): void;
    (event: Extract<EventName, `keypress`>, handler: KeypressEventHandler): void;
    (event: Extract<EventName, `end`>, handler: EndEventHandler): void;
  },
  listen: (paused?: boolean) => void;
  pause: () => void;
  resume: () => void;
  end: () => void;
};
