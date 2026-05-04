import c from 'chalk';
import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import type { Man } from './core/man/index.ts';
import { printMan } from './core/man/index.ts';
import { withResolvers } from './core/tools/withResolvers.ts';
import type { TextPromptState } from './index.ts';
import type { TextPromptStateChangeReason } from './index.ts';
import type { TextPromptStateUpdate } from './index.ts';
import type { TextOpts } from './index.ts';
import type { TextResult } from './index.ts';
import type { TextValidationHint } from './index.ts';
import { TEXT_DEFAULT_WIDTH } from './index.ts';
import { createWriter } from './index.ts';
import { getClipboard } from './index.ts';
import { setClipboard } from './index.ts';
import { stdin } from './index.ts';
import { symbol } from './index.ts';
import { textPrompt } from './index.ts';
import { TerminatedByCtrlC } from './index.ts';
import { TerminatedByEsc } from './index.ts';
import { getManPage } from './text.man.ts';

type TextState = {
  isNull: boolean;
  promptState: TextPromptState;
  status: TextStatus;
  warn: null | string[] | TextValidationHint[];
};

type TextStatus =
  | `default`
  | `completed`
  | `canceled`
  | `terminated`
  | `quick-actions-mode`
  | `text-selection-mode`
  | `help-mode`;

export async function text<
  TNullable extends boolean = false,
>(opts: TextOpts<TNullable>): Promise<TextResult<TNullable>> {
  const width = Math.max(0, opts?.width ?? TEXT_DEFAULT_WIDTH);

  let state: TextState = {
    isNull: false,
    promptState: null as any as TextPromptState,
    status: `default`,
    warn: null,
  };

  let man: null | Man = null;

  const setStatus = (status: TextStatus) => {
    state = { ...state, status: status };
  };

  const setIsNull = (isNull: boolean) => {
    state = { ...state, isNull };
  };

  const setWarn = (warn: null | string[] | TextValidationHint[]) => {
    state = { ...state, warn };
  };

  const setPromptState = (promptState: TextPromptState) => {
    state = { ...state, promptState };
  };

  const openMan = () => {
    man = printMan(getManPage);
  };

  const closeMan = () => {
    man!.end();
    man = null;
  };

  const copyEntireText = () => {
    setClipboard(state.promptState.value);
  };

  const copyEntireTextAndEnterDefaultMode = () => {
    copyEntireText();
    enterDefaultMode();
  };

  const cutEntireTextAndEnterDefaultMode = () => {
    copyEntireText();
    deleteEntireTextAndEnterDefaultMode();
  };

  const deleteEntireTextAndEnterDefaultMode = () => {
    enterDefaultMode({
      value: ``,
      cursor: 0,
    });
  };

  const pasteAndEnterDefaultMode = () => {
    const value = getClipboard() ?? ``;
    const chars = state.promptState.value.split(``);
    chars.splice(state.promptState.cursor, 0, value);
    const nextValue = chars.join(``);
    enterDefaultMode({
      value: nextValue,
      cursor: state.promptState.cursor + value.length,
    });
  };

  const unselectTextAndEnterDefaultMode = () => {
    enterDefaultMode({
      selection: null,
    });
  };

  const deleteSelectedTextAndEnterDefaultMode = () => {
    const selection = state.promptState.selection!;
    const selectionRegion = [selection[0], selection[0] + selection[1]].sort((a, b) => a - b);
    const chars = state.promptState.value.split(``);
    chars.splice(selectionRegion[0], selectionRegion[1] - selectionRegion[0] + 1);
    const nextValue = chars.join(``);
    const nextCursor = selectionRegion[0];
    enterDefaultMode({
      value: nextValue,
      cursor: nextCursor,
      selection: null,
    });
  };

  const copySelectedTextAndEnterDefaultMode = () => {
    copySelectedText();
    unselectTextAndEnterDefaultMode();
  };

  const cutSelectedTextAndEnterDefaultMode = () => {
    copySelectedText();
    deleteSelectedTextAndEnterDefaultMode();
  };

  const copySelectedText = () => {
    const selection = state.promptState.selection!;
    const selectionRegion = [selection[0], selection[0] + selection[1]].sort((a, b) => a - b);
    const chars = state.promptState.value.split(``);
    const copiedChars = chars.slice(selectionRegion[0], selectionRegion[1] + 1);
    const copiedText = copiedChars.join(``);
    setClipboard(copiedText);
  };

  const toggleNullAndEnterDefaultMode = () => {
    setWarn(null);
    if (state.isNull) {
      setIsNull(false);
      enterDefaultMode({
        value: state.promptState.value,
        cursor: state.promptState.value.length,
      });
    }
    else {
      setIsNull(true);
      enterDefaultMode();
    }
  };

  const enterQuickActionsMode = () => {
    setWarn(null);
    setStatus(`quick-actions-mode`);
    if (state.isNull) {
      render();
    }
    else {
      promptListener.pause({
        cursorInverse: true,
      });
    }
  };

  const enterHelpMode = () => {
    setStatus(`help-mode`);
  };

  const enterTextSelectionMode = () => {
    setStatus(`text-selection-mode`);
    promptListener.resume({
      selection: [state.promptState.cursor, 0],
    });
  };

  const selectEntireText = () => {
    promptListener.push({
      selection: [0, state.promptState.value.length - 1],
    });
  };

  const selectEntireTextAndEnterTextSelectionMode = () => {
    setStatus(`text-selection-mode`);
    promptListener.resume({
      selection: [0, state.promptState.value.length - 1],
    });
  };

  const enterDefaultMode = (promptListenerStateUpdate?: null | TextPromptStateUpdate) => {
    const currentStatus = state.status;
    setStatus(`default`);
    switch (currentStatus) {
      case `quick-actions-mode`: {
        if (state.isNull) {
          render();
        }
        else {
          promptListener.resume(promptListenerStateUpdate);
        }
        break;
      }
      case `text-selection-mode`: {
        if (state.isNull) {
          promptListener.pause(promptListenerStateUpdate);
        }
        else {
          promptListener.push(promptListenerStateUpdate!);
        }
        break;
      }
      case `help-mode`: {
        if (state.isNull) {
          render();
        }
        else {
          promptListener.resume(promptListenerStateUpdate);
        }
      }
    }
  };

  const tryComplete = () => {
    const validationResult = opts.validate
      ? opts.validate((state.isNull ? null : state.promptState.value) as TNullable extends true ? null | string : string)
      : null;
    if (validationResult) {
      // We can beep here
      setWarn(validationResult);
      render();
    }
    else {
      complete();
    }
  };

  const complete = () => {
    setStatus(`completed`);
    render();
    exit(false, false);
  };

  const cancel = () => {
    setStatus(`canceled`);
    render();
    exit(true, false);
  };

  const terminate = () => {
    setStatus(`terminated`);
    render();
    exit(true, true);
  };

  const exit = (canceled: boolean, terminated: boolean) => {
    resolve({
      canceled,
      terminated,
      value: (state.isNull ? null : state.promptState.value) as TNullable extends true ? null | string : string,
    });
  };

  const hints: string[] = opts.hints ? [...opts.hints] : [];

  if (opts.nullable && (opts.printNullableHint ?? true)) {
    hints.push(`This field is nullable`);
  }

  const writer = createWriter();

  const render = () => {
    const lines: string[] = [];

    switch (state.status) {
      case `default`:
      case `quick-actions-mode`:
      case `text-selection-mode`:
      case `help-mode`: {
        const defaultHelpText = (opts.printDefaultHelpText ?? true)
          ? state.status === `default`
            ? c.dim.gray(getHintText(`Quick Actions and Help: "Ctrl + Q" | Exit: "Esc"`))
            : state.status === `quick-actions-mode`
              ? c.yellow(getHintText(`[Quick Actions] Help: "H" | Exit: "Q" or "Ecs"`))
              : state.status === `text-selection-mode`
                ? c.yellow(getHintText(`[Text Selection] Exit: "Q" or "Ecs"`))
                : null
          : null;

        const helpTextLines: string[] = [];

        if (state.warn) {
          const warn = state.warn;
          hints.forEach((hint, index) => {
            const validationHint = warn.find((validationHint) => {
              return typeof validationHint === `object` && validationHint.hintIndex === index;
            }) as undefined | TextValidationHint;
            if (validationHint) {
              if (validationHint.hint) {
                helpTextLines.push(c.red(getHintText(validationHint.hint)));
              }
              else {
                helpTextLines.push(c.red(getHintText(hint)));
              }
            }
            else {
              helpTextLines.push(c.gray(getHintText(hint)));
            }
          });
          warn.forEach((validationHint) => {
            if (typeof validationHint === `string`) {
              helpTextLines.push(c.red(getHintText(validationHint)));
            }
          });
        }
        else {
          hints.forEach((hint) => {
            helpTextLines.push(c.gray(getHintText(hint)));
          });
        }

        if (defaultHelpText) {
          helpTextLines.push(defaultHelpText);
        }

        const promptMessage = getPromptMessage(opts.message);
        const promptText = getPromptText(state.promptState.text, state.isNull);
        const dashedLine = getDashedLine(state.promptState.value, state.promptState.shift, width);

        const promptMarker = state.warn ? symbol.WARN_PROMPT_MARKER : symbol.ACTIVE_PROMPT_MARKER;
        const promptBar = state.warn ? symbol.WARN_PROMPT_BAR : symbol.ACTIVE_PROMPT_BAR;
        const promptTerminator = state.warn ? symbol.WARN_PROMPT_TERMINATOR : symbol.ACTIVE_PROMPT_TERMINATOR;

        lines.push(`${promptMarker}  ${promptMessage}`);
        lines.push(`${promptBar}  ${promptText}`);
        lines.push(`${promptTerminator}  ${dashedLine}`);
        lines.push(...helpTextLines);
        break;
      }
      case `canceled`: {
        const promptText = getPromptFinalText(state.promptState.value, state.isNull, width);
        lines.push(`${symbol.CANCELED_PROMPT_MARKER}  ${c.dim(opts.message)}`);
        lines.push(`${symbol.CANCELED_PROMPT_BAR}  ${promptText}`);
        lines.push(`${symbol.CANCELED_PROMPT_BAR}`);
        lines.push(`${symbol.CANCELED_PROMPT_TERMINATOR}  ${c.yellow(opts.canceledMessage ?? `Canceled`)}`);
        lines.push(` `);
        break;
      }
      case `terminated`: {
        const promptText = getPromptFinalText(state.promptState.value, state.isNull, width);
        lines.push(`${symbol.TERMINATED_PROMPT_MARKER}  ${c.dim(opts.message)}`);
        lines.push(`${symbol.TERMINATED_PROMPT_BAR}  ${promptText}`);
        lines.push(`${symbol.TERMINATED_PROMPT_BAR}`);
        lines.push(`${symbol.TERMINATED_PROMPT_TERMINATOR}  ${c.red(opts.terminatedMessage ?? `Terminated`)}`);
        lines.push(` `);
        break;
      }
      case `completed`: {
        const promptText = getPromptFinalText(state.promptState.value, state.isNull, width);
        lines.push(`${symbol.COMPLETED_PROMPT_MARKER}  ${c.dim(opts.message)}`);
        lines.push(`${symbol.COMPLETED_PROMPT_BAR}  ${promptText}`);
        lines.push(`${symbol.BAR}`);
        break;
      }
    }

    writer.write({
      lines,
      animateInitial: true,
    });
  };

  const onStateChange = (reason: TextPromptStateChangeReason, promptState: TextPromptState) => {
    switch (reason) {
      // First time, big time
      case `initialization`: {
        // Let's decide here how we'll proceed, with `null` or with text...
        setIsNull( !! opts.nullable && opts.initialValue == null);
        break;
      }
      case `text-changed`: {
        setWarn(null);
        break;
      }
    }
    setPromptState(promptState);
    render();
  };

  const onData = (data: Buffer) => {
    const key = data.toString();

    // The "switch-case" symphony, movement 3: "The Neverending Story"
    switch (state.status) {
      case `default`: {
        switch (key) {
          case stdin.key.ctrlC: {
            terminate();
            break;
          }
          case stdin.key.esc: {
            cancel();
            break;
          }
          case stdin.key.return: {
            tryComplete();
            break;
          }
          case stdin.key.ctrlQ: {
            enterQuickActionsMode();
            break;
          }
        }
        break;
      }
      case `quick-actions-mode`: {
        switch (key) {
          case stdin.key.ctrlC: {
            terminate();
            break;
          }
          case stdin.key.esc:
          case `q`: {
            enterDefaultMode();
            break;
          }
          case stdin.key.backspace:
          case stdin.key.delete:
          case `d`: {
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              deleteEntireTextAndEnterDefaultMode();
            }
            break;
          }
          case `n`: {
            if (opts.nullable) {
              toggleNullAndEnterDefaultMode();
            }
            break;
          }
          case `a`: {
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              selectEntireTextAndEnterTextSelectionMode();
            }
            break;
          }
          case `c`: {
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              copyEntireTextAndEnterDefaultMode();
            }
            break;
          }
          case `x`: {
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              cutEntireTextAndEnterDefaultMode();
            }
            break;
          }
          case `v`: {
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              pasteAndEnterDefaultMode();
            }
            break;
          }
          case `s`: {
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              enterTextSelectionMode();
            }
            break;
          }
          case `h`: {
            openMan();
            enterHelpMode();
            break;
          }
        }
        break;
      }
      case `text-selection-mode`: {
        switch (key) {
          case stdin.key.ctrlC: {
            terminate();
            break;
          }
          case stdin.key.esc:
          case `q`: {
            unselectTextAndEnterDefaultMode();
            break;
          }
          case stdin.key.backspace:
          case stdin.key.delete:
          case `d`: {
            deleteSelectedTextAndEnterDefaultMode();
            break;
          }
          case `a`: {
            selectEntireText();
            break;
          }
          case `c`: {
            copySelectedTextAndEnterDefaultMode();
            break;
          }
          case `x`: {
            cutSelectedTextAndEnterDefaultMode();
            break;
          }
        }
        break;
      }
      case `help-mode`: {
        switch (key) {
          case stdin.key.ctrlC: {
            closeMan();
            terminate();
            break;
          }
          case stdin.key.esc:
          case `q`: {
            closeMan();
            enterDefaultMode();
            break;
          }
          case stdin.key.backspace: {
            closeMan();
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              deleteEntireTextAndEnterDefaultMode();
            }
            break;
          }
          case `n`: {
            closeMan();
            if (opts.nullable) {
              toggleNullAndEnterDefaultMode();
            }
            else {
              enterDefaultMode();
            }
            break;
          }
          case `c`: {
            closeMan();
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              copyEntireTextAndEnterDefaultMode();
            }
            break;
          }
          case `x`: {
            closeMan();
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              cutEntireTextAndEnterDefaultMode();
            }
            break;
          }
          case `v`: {
            closeMan();
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              pasteAndEnterDefaultMode();
            }
            break;
          }
          case `s`: {
            closeMan();
            if (state.isNull) {
              enterDefaultMode();
            }
            else {
              enterTextSelectionMode();
            }
            break;
          }
        }
      }
    }
  };

  const { promise, resolve } = withResolvers<TextResult<TNullable>>();

  const promptListener = textPrompt({
    blinkInterval: opts.blinkInterval,
    initialCursor: opts.initialValue?.length ?? 0,
    initialValue: opts.initialValue ?? ``,
    maxLength: opts.maxLength,
    width,
  });

  promptListener.on(`statechange`, onStateChange);
  promptListener.on(`data`, onData);

  // Maybe we should start in `paused` mode if the default value is `null`
  const paused = !! opts.nullable && opts.initialValue == null;
  promptListener.listen(null, paused);

  const result = await promise;
  promptListener.end();
  await writer.end();

  if (result.terminated && (opts.throwOnCtrlC ?? true)) {
    throw new TerminatedByCtrlC(opts.name ? `Text prompt \`${opts.name}\``: `Text prompt`);
  }

  if (result.canceled && (opts.throwOnEsc ?? false)) {
    throw new TerminatedByEsc(opts.name ? `Text prompt \`${opts.name}\``: `Text prompt`);
  }

  return result;
}

function getHintText(hint: string) {
  return `${symbol.BAR}  ${hint}`;
}

function getPromptMessage(message: string) {
  return c.cyan(message);
}

function getDashedLine(value: string, shift: number, width: number) {
  const leftOverflow = !! shift;
  const rightOverflow = value.length > shift + width;
  const left = leftOverflow ? c.cyan(`${symbol.LEFT} `) : rightOverflow ? c.gray(`${symbol.LEFT} `) : c.gray(symbol.DASH + symbol.DASH);
  const right = rightOverflow ? c.cyan(` ${symbol.RIGHT}`) : leftOverflow ? c.gray(` ${symbol.RIGHT}`) : c.gray(symbol.DASH + symbol.DASH);
  const center = c.gray(symbol.DASH.repeat(Math.max(0, width - 4)));
  return c.dim(left + center + right);
}

function getPromptText(text: string, isNull: boolean) {
  if (isNull) {
    return c.yellow(`null`);
  }
  else {
    return text;
  }
}

function getPromptFinalText(value: string, isNull: boolean, width: number) {
  if (isNull) {
    return c.yellow(`null`);
  }
  else {
    const textLength = stripAnsi(value).length;
    if (textLength > width) {
      return sliceAnsi(value, 0, width - 3) + c.yellow(`...`);
    }
    else {
      return value;
    }
  }
}
