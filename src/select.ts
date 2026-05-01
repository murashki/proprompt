import c from 'chalk';
import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import type { Man } from './core/man/index.ts';
import { printMan } from './core/man/index.ts';
import type { SelectValidationHint } from './index.ts';
import type { SelectProps } from './index.ts';
import type { SelectResult } from './index.ts';
import { SELECT_DEFAULT_MAX_HEIGHT } from './index.ts';
import { SELECT_DEFAULT_WIDTH } from './index.ts';
import { createWriter } from './index.ts';
import { stdin } from './index.ts';
import { symbol } from './index.ts';
import { TerminatedByCtrlC } from './index.ts';
import { TerminatedByEsc } from './index.ts';
import { withResolvers } from './index.ts';
import { getManPage } from './select.man.ts';

type ContentOption = {
  start: number;
  end: number;
  lines: string[];
};

type SelectState = {
  isNull: boolean;
  selectedOption: number;
  shift: number;
  shiftDirection: ShiftDirection;
  status: SelectStatus;
  warn: null | string[] | SelectValidationHint[];
};

type SelectStatus =
  | `default`
  | `completed`
  | `canceled`
  | `terminated`
  | `quick-actions-mode`
  | `help-mode`;

type ShiftDirection = `down` | `up`;

export async function select<
  TValue extends any = any,
  TNullable extends boolean = false,
>(props: SelectProps<TValue, TNullable>): Promise<SelectResult<TValue, TNullable>> {
  const width = Math.max(0, props?.width ?? SELECT_DEFAULT_WIDTH);
  const maxHeight = Math.max(0, props?.maxHeight ?? SELECT_DEFAULT_MAX_HEIGHT);
  const contentOverflow = props.contentOverflow ?? `hidden`;

  let contentHeight = 0;
  const content: ContentOption[] = props.options.map((option) => {
    let lines: string[];
    if (contentOverflow === `word-wrap`) {
      lines = wrapAnsi(option.label, width -  2, { hard: true, wordWrap: true }).split(`\n`);
    }
    else if (contentOverflow === `hard-wrap`) {
      lines = wrapAnsi(option.label, width - 2, { hard: true, wordWrap: false }).split(`\n`);
    }
    else {
      lines = [sliceAnsi(option.label, 0, width - 2)];
    }

    const start = contentHeight + (props.nullable ? 1 : 0);
    const end = contentHeight + lines.length - 1 + (props.nullable ? 1 : 0);
    contentHeight += lines.length;
    return { start, end, lines };
  });

  const initialIsNull = !! props.nullable && props.initialValue == null;

  const initialSelectedOption = props.initialValue != null
    ? props.options.findIndex((option) => option.value === props.initialValue) ?? 0
    : 0;

  const initialShiftDirection = `down`;

  const initialShift = getShift(0, initialShiftDirection, initialSelectedOption, initialIsNull, !! props.nullable, content, contentHeight, maxHeight);

  let state: SelectState = {
    isNull: initialIsNull,
    selectedOption: initialSelectedOption,
    shift: initialShift,
    shiftDirection: initialShiftDirection,
    status: `default`,
    warn: null,
  };

  let man: null | Man = null;

  const setIsNull = (isNull: boolean) => {
    state = { ...state, isNull };
  };

  const setSelectedOption = (selectedOption: number) => {
    state = { ...state, selectedOption };
  };

  const setShift = (shift: number) => {
    state = { ...state, shift };
  };

  const setShiftDirection = (shiftDirection: ShiftDirection) => {
    state = { ...state, shiftDirection };
  };

  const setStatus = (status: SelectStatus) => {
    state = { ...state, status: status };
  };

  const setWarn = (warn: null | string[] | SelectValidationHint[]) => {
    state = { ...state, warn };
  };

  const openMan = () => {
    man = printMan(getManPage);
  };

  const closeMan = () => {
    man!.end();
    man = null;
  };

  const toggleNullAndEnterDefaultMode = () => {
    setWarn(null);
    if (state.isNull) {
      setIsNull(false);
      setShiftDirection(`down`);
      const shift = getShift(state.shift, state.shiftDirection, state.selectedOption, state.isNull, !! props.nullable, content, contentHeight, maxHeight);
      setShift(shift);
      enterDefaultMode();
    }
    else {
      setIsNull(true);
      setShiftDirection(`up`);
      setShift(0);
      enterDefaultMode();
    }
  };

  const switchToNull = () => {
    setShift(0);
    setShiftDirection(`up`);
    setIsNull(true);
    setWarn(null);
    render();
  };

  const switchToOption = (selectedOption: number) => {
    setIsNull(false);
    setSelectedOption(selectedOption);
    setShiftDirection(`down`);
    const shift = getShift(state.shift, state.shiftDirection, state.selectedOption, state.isNull, !! props.nullable, content, contentHeight, maxHeight);
    setShift(shift);
    setWarn(null);
    render();
  };

  const changeOption = (selectedOption: number, shiftDirection: ShiftDirection) => {
    setSelectedOption(selectedOption);
    setShiftDirection(shiftDirection);
    const shift = getShift(state.shift, state.shiftDirection, state.selectedOption, state.isNull, !! props.nullable, content, contentHeight, maxHeight);
    setShift(shift);
    setWarn(null);
    render();
  };

  const enterQuickActionsMode = () => {
    setWarn(null);
    setStatus(`quick-actions-mode`);
    render();
  };

  const enterHelpMode = () => {
    setStatus(`help-mode`);
  };

  const enterDefaultMode = () => {
    setStatus(`default`);
    render();
  };

  const tryComplete = () => {
    const validationResult = props.validate
      ? props.validate((state.isNull ? null : props.options[state.selectedOption].value) as TNullable extends true ? null | TValue : TValue)
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
      value: (state.isNull ? null : props.options[state.selectedOption].value) as TNullable extends true ? null | TValue : TValue,
    });
  };

  const hints: string[] = props.hints ? [...props.hints] : [];

  if (props.nullable && (props.printNullableHint ?? true)) {
    hints.push(`This field is nullable`);
  }

  const writer = createWriter();

  const render = () => {
    const lines: string[] = [];

    switch (state.status) {
      case `default`:
      case `quick-actions-mode`:
      case `help-mode`: {
        const defaultHelpText = (props.printDefaultHelpText ?? true)
          ? state.status === `default`
            ? c.dim.gray(getHintText(`Quick Actions and Help: "Ctrl + Q" | Exit: "Esc"`))
            : state.status === `quick-actions-mode`
              ? c.yellow(getHintText(`[Quick Actions] Help: "H" | Exit: "Q" or "Ecs"`))
              : null
          : null;

        const helpTextLines: string[] = [];

        if (state.warn) {
          const warn = state.warn;
          hints.forEach((hint, index) => {
            const validationHint = warn.find((validationHint) => {
              return typeof validationHint === `object` && validationHint.hintIndex === index;
            }) as undefined | SelectValidationHint;
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

        const promptMarker = state.warn ? symbol.WARN_PROMPT_MARKER : symbol.ACTIVE_PROMPT_MARKER;
        const promptBar = state.warn ? symbol.WARN_PROMPT_BAR : symbol.ACTIVE_PROMPT_BAR;
        const promptTerminator = state.warn ? symbol.WARN_PROMPT_TERMINATOR : symbol.ACTIVE_PROMPT_TERMINATOR;

        const promptMessage = getPromptMessage(props.message, width);
        const contentLines = getContentLines(content, state.selectedOption, state.shift, state.isNull, !! props.nullable, maxHeight, width, promptBar);
        const dashedLine = getDashedLine(width);

        lines.push(`${promptMarker}  ${promptMessage}`);
        lines.push(...contentLines);
        lines.push(`${promptTerminator}  ${dashedLine}`);
        lines.push(...helpTextLines);
        break;
      }
      case `canceled`: {
        const promptText = getPromptFinalText(props.options[state.selectedOption].label, state.isNull, width);
        lines.push(`${symbol.CANCELED_PROMPT_MARKER}  ${c.dim(props.message)}`);
        lines.push(`${symbol.CANCELED_PROMPT_BAR}  ${promptText}`);
        lines.push(`${symbol.CANCELED_PROMPT_BAR}`);
        lines.push(`${symbol.CANCELED_PROMPT_TERMINATOR}  ${c.yellow(props.canceledMessage ?? `Canceled`)}`);
        lines.push(` `);
        break;
      }
      case `terminated`: {
        const promptText = getPromptFinalText(props.options[state.selectedOption].label, state.isNull, width);
        lines.push(`${symbol.TERMINATED_PROMPT_MARKER}  ${c.dim(props.message)}`);
        lines.push(`${symbol.TERMINATED_PROMPT_BAR}  ${promptText}`);
        lines.push(`${symbol.TERMINATED_PROMPT_BAR}`);
        lines.push(`${symbol.TERMINATED_PROMPT_TERMINATOR}  ${c.red(props.terminatedMessage ?? `Terminated`)}`);
        lines.push(``);
        break;
      }
      case `completed`: {
        const promptText = getPromptFinalText(props.options[state.selectedOption].label, state.isNull, width);
        lines.push(`${symbol.COMPLETED_PROMPT_MARKER}  ${c.dim(props.message)}`);
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

  const onData = (data: Buffer) => {
    const key = data.toString();

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
          case stdin.key.up: {
            if (state.status === `default`) {
              if ( ! state.isNull) {
                if (state.selectedOption > 0) {
                  changeOption(state.selectedOption - 1, `up`);
                }
                else if (props.nullable) {
                  switchToNull();
                }
              }
            }
            break;
          }
          case stdin.key.down: {
            if (state.status === `default`) {
              if (state.isNull) {
                switchToOption(0);
              }
              else if (state.selectedOption < props.options.length - 1) {
                changeOption(state.selectedOption + 1, `down`);
              }
            }
            break;
          }
          case stdin.key.left:
          case stdin.key.shiftLeft: {
            if (state.status === `default`) {
              if ( ! state.isNull) {
                if (props.nullable) {
                  switchToNull();
                }
                else if (state.selectedOption > 0) {
                  changeOption(0, `up`);
                }
              }
            }
            break;
          }
          case stdin.key.right:
          case stdin.key.shiftRight: {
            if (state.status === `default`) {
              if (state.isNull) {
                switchToOption(props.options.length - 1);
              }
              else if (state.selectedOption < props.options.length - 1) {
                changeOption(props.options.length - 1,  `down`);
              }
            }
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
          case `n`: {
            if (props.nullable) {
              toggleNullAndEnterDefaultMode();
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
          case `n`: {
            closeMan();
            if (props.nullable) {
              toggleNullAndEnterDefaultMode();
            }
            else {
              enterDefaultMode();
            }
            break;
          }
        }
      }
    }
  };

  const { promise, resolve } = withResolvers<SelectResult<TValue, TNullable>>();

  const listener = stdin.createListener();
  listener.on(`data`, onData);
  listener.listen();

  render();

  const result = await promise;
  listener.end();
  await writer.end();

  if (result.terminated && (props.throwOnCtrlC ?? true)) {
    throw new TerminatedByCtrlC(props.name ? `Select prompt \`${props.name}\`` : `Select prompt`);
  }

  if (result.canceled && (props.throwOnEsc ?? false)) {
    throw new TerminatedByEsc(props.name ? `Select prompt \`${props.name}\`` : `Select prompt`);
  }

  return result;
}

function getHintText(hint: string) {
  return `${symbol.BAR}  ${hint}`;
}

function getPromptMessage(message: string, width: number) {
  const dashedLine = c.dim.gray(symbol.DASH.repeat(Math.max(0, width - stripAnsi(message).length - 1)));
  return `${c.cyan(message)} ${dashedLine}`;
}

function getContentLines(content: ContentOption[], selectedOption: number, shift: number, isNull: boolean, nullable: boolean, maxHeight: number, width: number, promptBar: string) {
  const promptOptions = content.flatMap((contentOption, index) => {
    if ( ! isNull && selectedOption === index) {
      return contentOption.lines.map((line, index) => {
        if (index === 0) {
          return `${symbol.ACTIVE_OPTION_MARKER} ${line}`;
        }
        else {
          return `  ${line}`;
        }
      });
    }
    else {
      return contentOption.lines.map((line, index) => {
        if (index === 0) {
          return `${symbol.OPTION_MARKER} ${c.dim(line)}`;
        }
        else {
          return `  ${c.dim(line)}`;
        }
      });
    }
  });

  if (nullable) {
    if (isNull) {
      promptOptions.unshift(`${symbol.ACTIVE_OPTION_MARKER} ${c.yellow(`null`)}`);
    }
    else {
      promptOptions.unshift(`${symbol.OPTION_MARKER} ${c.dim.yellow(`null`)}`);
    }
  }

  const upOverflow = !! shift;
  const bottomOverflow = selectedOption < content.length - 1 && content[content.length - 1].end + 1 > maxHeight;

  const contentLines = promptOptions.slice(shift, shift + maxHeight);
  return contentLines.map((line, index) => {
    const space = ` `.repeat(Math.max(0, width - stripAnsi(line).length));

    if (upOverflow || bottomOverflow) {
      if (index === 0) {
        return upOverflow
          ? `${promptBar}  ${line}${space}  ${c.dim.cyan(symbol.UP)}`
          : `${promptBar}  ${line}${space}  ${c.dim.gray(symbol.UP)}`;
      }
      if (index === contentLines.length - 1) {
        return bottomOverflow
          ? `${promptBar}  ${line}${space}  ${c.dim.cyan(symbol.DOWN)}`
          : `${promptBar}  ${line}${space}  ${c.dim.gray(symbol.DOWN)}`;
      }
    }
    // A good option for the slider is ▓
    return upOverflow || bottomOverflow
      ? `${promptBar}  ${line}${space}  ${c.dim.gray(symbol.VERTICAL_DASH)}`
      : `${promptBar}  ${line}${space}  ${c.dim.gray(symbol.VERTICAL_DASH)}`;
  });
}

function getDashedLine(width: number) {
  return c.dim.gray(symbol.DASH.repeat(width));
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

function getShift(currentShift: number, shiftDirection: ShiftDirection, selectedOption: number, isNull: boolean, nullable: boolean, content: ContentOption[], contentHeight: number, maxHeight: number) {
  const actualContentHeight = nullable ? contentHeight + 1 : contentHeight;
  const nextActiveLine = isNull ? 0 : shiftDirection === `up` ? content[selectedOption].start : Math.min(content[selectedOption].start + maxHeight - 1, content[selectedOption].end);

  if (actualContentHeight <= maxHeight) {
    return 0;
  }
  else {
    let visibleRegion = [currentShift, currentShift + maxHeight - 1];

    if (actualContentHeight - 1 < visibleRegion[1]) {
      const leftShift = Math.min(visibleRegion[0], visibleRegion[1] - (actualContentHeight - 1));
      visibleRegion = [visibleRegion[0] - leftShift, visibleRegion[1] - leftShift];
    }

    if (nextActiveLine < visibleRegion[0]) {
      const leftShift = visibleRegion[0] - nextActiveLine;
      visibleRegion = [visibleRegion[0] - leftShift, visibleRegion[1] - leftShift];
    }
    else if (nextActiveLine > visibleRegion[1]) {
      const rightShift = nextActiveLine - visibleRegion[1];
      visibleRegion = [visibleRegion[0] + rightShift, visibleRegion[1] + rightShift];
    }

    return visibleRegion[0];
  }
}
