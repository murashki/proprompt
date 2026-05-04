import readline from 'node:readline';
import type { Key } from 'node:readline';
import type { DataEventHandler } from './@types/DataEventHandler.ts';
import type { EndEventHandler } from './@types/EndEventHandler.ts';
import type { EventName } from './@types/EventName.ts';
import type { KeypressEventHandler } from './@types/KeypressEventHandler.ts';
import type { Listener } from './@types/Listener.ts';

readline.emitKeypressEvents(process.stdin);

type Action = `listen` | `pause` | `resume` | `end`;

type State = `initial` | `listening` | `paused` | `ended`;

export function createListener(): Listener {
  const eventHandlers = {
    data: null as null | DataEventHandler,
    keypress: null as null | KeypressEventHandler,
    end: null as null | EndEventHandler,
  };

  const on = (event: EventName, eventHandler: any) => {
    if ( ! (event in eventHandlers)) {
      throw new Error(`Unexpected event name "${event}"`);
    }
    eventHandlers[event] = eventHandler;
  };

  let state: State = `initial`;

  const allowedStates: Record<Action, { states: State[], state: State }> = {
    listen: { states: [`initial`], state: `listening` },
    pause: { states: [`listening`], state: `paused` },
    resume: { states: [`paused`], state: `listening` },
    end: { states: [`listening`, `paused`], state: `ended` },
  };

  const checkAllowedState = (action: Action): boolean => {
    if (allowedStates[action].states.includes(state)) {
      state = allowedStates[action].state;
      return true;
    }
    return false;
  };

  const onData = (data: Buffer) => {
    // Even though we unsubscribe from the data event when transitioning to the `ended` state, this
    // handler can still be triggered by previously received data.
    if (state === `listening`) {
      eventHandlers.data?.(data);
    }
  };

  const onKeypress = (char: undefined | string, key: Key) => {
    // This handler is triggered after the `onData` handler, so the user might have already called
    // `listener.end`, transitioning the listener to the `ended` state.
    if (state === `listening`) {
      eventHandlers.keypress?.(char, key);
    }
  };

  const onEnd = () => {
    eventHandlers.end?.();
  };

  const listen = (paused?: boolean) => {
    if (checkAllowedState(`listen`)) {
      if (paused) {
        state = `paused`;
      }
      else {
        process.stdin.addListener(`data`, onData);
        process.stdin.addListener(`keypress`, onKeypress);
      }
    }
  };

  const pause = () => {
    if (checkAllowedState(`pause`)) {
      process.stdin.removeListener(`keypress`, onKeypress);
      process.stdin.removeListener(`data`, onData);
    }
  };

  const resume = () => {
    if (checkAllowedState(`resume`)) {
      process.stdin.addListener(`data`, onData);
      process.stdin.addListener(`keypress`, onKeypress);
    }
  };

  const end = () => {
    if (checkAllowedState(`end`)) {
      process.stdin.removeListener(`keypress`, onKeypress);
      process.stdin.removeListener(`data`, onData);
      onEnd();
    }
  };

  return {
    on,
    listen,
    pause,
    resume,
    end,
  };
}
