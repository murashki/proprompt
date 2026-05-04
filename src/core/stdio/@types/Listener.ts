import type { DataEventHandler } from './DataEventHandler.ts';
import type { EventName } from './EventName.ts';
import type { EndEventHandler } from './EndEventHandler.ts';
import type { KeypressEventHandler } from './KeypressEventHandler.ts';

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
