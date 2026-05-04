import type { Key } from 'node:readline';
import { inspect } from 'node:util';
import c from 'chalk';
import sliceAnsi from 'slice-ansi';
import type { TextPromptCharEventHandler } from './@types/TextPromptCharEventHandler.ts';
import type { TextPromptDataEventHandler } from './@types/TextPromptDataEventHandler.ts';
import type { TextPromptEventName } from './@types/TextPromptEventName.ts';
import type { TextPromptKeypressEventHandler } from './@types/TextPromptKeypressEventHandler.ts';
import type { TextPromptListener } from './@types/TextPromptListener.ts';
import type { TextPromptOpts } from './@types/TextPromptOpts.ts';
import type { TextPromptState } from './@types/TextPromptState.ts';
import type { TextPromptStateChangeEventHandler } from './@types/TextPromptStateChangeEventHandler.ts';
import type { TextPromptStateChangeReason } from './@types/TextPromptStateChangeReason.ts';
import type { TextPromptStateUpdate } from './@types/TextPromptStateUpdate.ts';
import { stdin } from './stdio/index.ts';
import { DEFAULT_BLINK_INTERVAL } from './constants.ts';

export function textPrompt(opts?: TextPromptOpts): TextPromptListener {
  const maxLength = Math.max(0, opts?.maxLength ?? Infinity);
  const width = Math.max(0, opts?.width ?? Infinity);
  const blinkInterval = Math.max(0, opts?.blinkInterval ?? DEFAULT_BLINK_INTERVAL);

  const eventHandlers = {
    statechange: null as null | TextPromptStateChangeEventHandler,
    data: null as null | TextPromptDataEventHandler,
    keypress: null as null | TextPromptKeypressEventHandler,
    char: null as null | TextPromptCharEventHandler,
  };

  const on = (event: TextPromptEventName, eventHandler: any) => {
    if ( ! (event in eventHandlers)) {
      throw new Error(`Unexpected event name "${event}"`);
    }
    eventHandlers[event] = eventHandler;
  };

  let listenerState: ListenerState = `initial`;

  const checkAllowedListenerState = (action: ListenerAction): boolean => {
    if (allowedListenerStates[action].states.includes(listenerState)) {
      listenerState = allowedListenerStates[action].state;
      return true;
    }
    return false;
  };

  let timeout: null | NodeJS.Timeout = null;

  let state: TextPromptState = {
    value: ``,
    cursor: 0,
    cursorInverse: false,
    selection: null,
    text: ``,
    shift: 0,
  };

  const updateState = (update: null | TextPromptStateUpdate, updateReason: TextPromptStateChangeReason) => {
    if (listenerState === `initial` || listenerState === `ended`) {
      throw new Error(`This should never have happened!`);
    }

    const value = getValue(updateReason, update?.value, state.value, maxLength);
    const cursor = getCursor(updateReason, update?.cursor, state.cursor, value);
    const cursorInverse = getCursorInverse(updateReason, update?.value, update?.cursor, update?.cursorInverse, state.cursorInverse, blinkInterval);
    const selection = getSelection(updateReason, update?.selection, state.selection, value);
    const { text, shift } = getTextAndShift(updateReason, update?.shift, state.shift, value, cursor, cursorInverse, selection, width);
    state = { ...state, value, cursor, cursorInverse, selection, text, shift };

    if (eventHandlers.statechange) {
      const update = eventHandlers.statechange(updateReason, state);
      if (update && updateReason !== `state-altered`) {
        updateState(update, `state-altered`);
        return;
      }
    }

    timeout != null && (clearTimeout(timeout), (timeout = null));

    if (listenerState === `listening` && ! state.selection && blinkInterval > 0) {
      timeout = setTimeout(() => {
        if (listenerState !== `listening`) {
          throw new Error(`This should never have happened!`);
        }
        updateState(null, `blink`);
      }, blinkInterval);
    }
  };

  const onData = (data: Buffer) => {
    const key = data.toString();

    if (listenerState === `listening`) {
      if (key === stdin.key.left) {
        if (state.selection) {
          if (state.selection[0] + state.selection[1] > 0) {
            updateState({ selection: [state.selection[0], state.selection[1] - 1] }, `navigation`);
          }
        }
        else {
          if (state.cursor > 0) {
            updateState({ cursor: state.cursor - 1 }, `navigation`);
          }
          else {
            updateState(null, `navigation`);
          }
        }
      }
      else if (key === stdin.key.right) {
        if (state.selection) {
          if (state.selection[0] + state.selection[1] < state.value.length - 1) {
            updateState({ selection: [state.selection[0], state.selection[1] + 1] }, `navigation`);
          }
        }
        else {
          if (state.cursor < state.value.length) {
            updateState({ cursor: state.cursor + 1 }, `navigation`);
          }
          else {
            updateState(null, `navigation`);
          }
        }
      }
      else if (key === stdin.key.shiftLeft) {
        if (state.selection) {
          updateState({ selection: [state.selection[0], - state.selection[0]] }, `navigation`);
        }
        else {
          updateState({ cursor: 0 }, `navigation`);
        }
      }
      else if (key === stdin.key.shiftRight) {
        if (state.selection) {
          updateState({ selection: [state.selection[0], state.value.length - state.selection[0] - 1] }, `navigation`);
        }
        else {
          updateState({ cursor: state.value.length }, `navigation`);
        }
      }
      else if (key === stdin.key.delete) {
        if ( ! state.selection) {
          if (state.cursor > 0) {
            const chars = state.value.split(``);
            chars.splice(state.cursor - 1, 1);
            const value = chars.join(``);
            updateState({ value, cursor: state.cursor - 1 }, `text-changed`);
          }
          else {
            updateState(null, `text-changed`);
          }
        }
      }

      // The most common symbol that can be written in a notebook
      const commonChar = getCommonChar(key);
      if (commonChar) {
        if ( ! state.selection) {
          let nextValue = state.value;
          let nextCursor = state.cursor;
          if (state.value.length < maxLength) {
            const chars = state.value.split(``);
            chars.splice(state.cursor, 0, commonChar);
            nextValue = chars.join(``);
            nextCursor = state.cursor + 1;
          }
          updateState({ value: nextValue, cursor: nextCursor, selection: null }, `text-changed`);
        }
      }
    }

    // Call handler at the end to give user the final say
    if (eventHandlers.data) {
      const update = eventHandlers.data(data, state);
      update && updateState(update, `state-altered`);
    }
  };

  const onKeypress = (char: undefined | string, key: Key) => {
    if (eventHandlers.keypress) {
      const update = eventHandlers.keypress(char, key, state);
      update && updateState(update, `state-altered`);
    }

    if (eventHandlers.char) {
      // The most common symbol that can be written in a notebook
      const commonChar = getCommonChar(key.sequence);
      if (commonChar) {
        const update = eventHandlers.char(commonChar, state);
        update && updateState(update, `state-altered`);
      }
    }
  };

  const listener = stdin.createListener();
  listener.on(`data`, onData);
  listener.on(`keypress`, onKeypress);

  const push = (update: TextPromptStateUpdate) => {
    updateState(update, `state-altered`);
  };

  const listen = (update?: null | TextPromptStateUpdate, paused?: boolean) => {
    if (checkAllowedListenerState(`listen`)) {
      if (paused) {
        listenerState = `paused`;
      }

      const value = update?.value ?? opts?.initialValue;
      const cursor = update?.cursor ?? opts?.initialCursor;
      const cursorInverse = update?.cursorInverse ?? opts?.initialCursorInverse;
      const selection = update?.selection === undefined ? opts?.initialSelection : update.selection;
      const shift = update?.shift ?? opts?.initialShift;
      updateState({ value, cursor, cursorInverse, selection, shift }, `initialization`);

      listener.listen();
    }
  };

  const pause = (update?: null | TextPromptStateUpdate) => {
    if (checkAllowedListenerState(`pause`)) {
      updateState(update ?? null, `pause`);
    }
  };

  const resume = (update?: null | TextPromptStateUpdate) => {
    if (checkAllowedListenerState(`resume`)) {
      updateState(update ?? null, `resume`);
    }
  };

  const end = () => {
    if (checkAllowedListenerState(`end`)) {
      listener.end();
      timeout != null && clearTimeout(timeout);
    }
  };

  return {
    on,
    push,
    listen,
    pause,
    resume,
    end,
  };
}

type ListenerAction = `listen` | `pause` | `resume` | `end`;

type ListenerState = `initial` | `listening` | `paused` | `ended`;

const allowedListenerStates: Record<ListenerAction, { states: ListenerState[], state: ListenerState }> = {
  listen: { states: [`initial`], state: `listening` },
  pause: { states: [`listening`], state: `paused` },
  resume: { states: [`paused`], state: `listening` },
  end: { states: [`listening`, `paused`], state: `ended` },
};

export function getCommonChar(key?: string) {
  return key === `\\` ? `\\` : !! key && inspect(key, { depth: null, colors: false }).length === 3 ? key : null;
}

function getValue(updateReason: TextPromptStateChangeReason, nextValue: undefined | string, currentValue: string, maxLength: number) {
  const actualValue = nextValue ?? currentValue;
  return actualValue.slice(0, maxLength);
}

function getCursor(updateReason: TextPromptStateChangeReason, nextCursor: undefined | number, currentCursor: number, value: string) {
  const actualCursor = nextCursor ?? currentCursor;
  return Math.max(0, Math.min(value.length, actualCursor));
}

function getCursorInverse(updateReason: TextPromptStateChangeReason, nextValue: undefined | string, nextCursor: undefined | number, nextCursorInverse: undefined | boolean, currentCursorInverse: boolean, blinkInterval: number) {
  return blinkInterval === 0
    ? true
    : nextCursorInverse ?? (
      updateReason === `blink`
        ? ! currentCursorInverse
        : [`initialization`, `resume`, `navigation`, `text-changed`].includes(updateReason)
          ? true
          : nextValue != null || nextCursor != null
            ? true
            : currentCursorInverse
    );
}

function getSelection(updateReason: TextPromptStateChangeReason, nextSelection: undefined | null | number[], currentSelection: null | number[], value: string) {
  const actualSelection = nextSelection === undefined ? currentSelection : nextSelection;
  if (actualSelection == null) {
    return actualSelection;
  }
  else {
    const selectionStartPoint = Math.max(0, Math.min(value.length - 1, actualSelection[0]));
    const selectionLength = Math.max( - (selectionStartPoint + 1), Math.min(value.length - selectionStartPoint - 1, actualSelection[1]));
    return [selectionStartPoint, selectionLength];
  }
}

function getTextAndShift(updateReason: TextPromptStateChangeReason, nextShift: undefined | number, currentShift: number, value: string, cursor: number, cursorInverse: boolean, selection: null | number[], width: number) {
  const actualText = selection ? applySelection(value, selection) : applyCursor(value, cursor, cursorInverse);
  const actualTextLength = selection ? value.length : cursor === value.length ? value.length + 1 : value.length;
  const actualCursor = selection ? selection[0] + selection[1] : cursor;
  const actualShift = nextShift ?? currentShift;

  if (actualTextLength <= width) {
    return { text: actualText, shift: 0 };
  }
  else {
    let visibleRegion = [actualShift, actualShift + width - 1];

    if (actualTextLength - 1 < visibleRegion[1]) {
      const leftShift = Math.min(visibleRegion[0], visibleRegion[1] - (actualTextLength - 1));
      visibleRegion = [visibleRegion[0] - leftShift, visibleRegion[1] - leftShift];
    }

    if (actualCursor < visibleRegion[0]) {
      const leftShift = visibleRegion[0] - actualCursor;
      visibleRegion = [visibleRegion[0] - leftShift, visibleRegion[1] - leftShift];
    }
    else if (actualCursor > visibleRegion[1]) {
      const rightShift = actualCursor - visibleRegion[1];
      visibleRegion = [visibleRegion[0] + rightShift, visibleRegion[1] + rightShift];
    }

    const nextText = sliceAnsi(actualText, visibleRegion[0], visibleRegion[1] + 1);
    const nextShift = visibleRegion[0];

    return { text: nextText, shift: nextShift };
  }
}

function applyCursor(value: string, cursor: number, cursorInverse: boolean) {
  const cleanText = cursor === value.length ? value + ` ` : value;
  if (cursorInverse) {
    const t1 = cleanText.slice(0, cursor);
    const t2 = cleanText.slice(cursor, cursor + 1);
    const t3 = cleanText.slice(cursor + 1);
    return `${t1}${c.inverse(t2)}${t3}`;
  }
  else {
    return cleanText;
  }
}

function applySelection(value: string, selection: number[]) {
  const selectionRegion = [selection[0], selection[0] + selection[1]].sort((a, b) => a - b);
  if (selection[1] < 0) {
    const t1 = value.slice(0, selectionRegion[0]);
    const t2 = value.slice(selectionRegion[0], selectionRegion[0] + 1);
    const t3 = value.slice(selectionRegion[0] + 1, selectionRegion[1] + 1);
    const t4 = value.slice(selectionRegion[1] + 1);
    return `${t1}${(c.underline.bgYellow(t2))}${(c.bgYellow(t3))}${t4}`;
  }
  else {
    const t1 = value.slice(0, selectionRegion[0]);
    const t2 = value.slice(selectionRegion[0], selectionRegion[1]);
    const t3 = value.slice(selectionRegion[1], selectionRegion[1] + 1);
    const t4 = value.slice(selectionRegion[1] + 1);
    return `${t1}${(c.bgYellow(t2))}${(c.underline.bgYellow(t3))}${t4}`;
  }
}
