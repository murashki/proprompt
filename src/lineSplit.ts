import c from 'chalk';
import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import type { LineSplitOpts } from './@types/LineSplitOpts.ts';
import { stdout } from './core/stdio/index.ts';
import * as symbol from './symbol.ts';

export function lineSplit(text: string, opts?: LineSplitOpts): string[] {
  let marker = symbol.BAR;
  let bar = symbol.BAR;
  switch (opts?.as) {
    case `info`: {
      marker = symbol.INFO_MARKER;
      bar = symbol.BAR;
      break;
    }
    case `success`: {
      marker = symbol.SUCCESS_MARKER;
      bar = symbol.BAR;
      break;
    }
    case `warning`: {
      marker = symbol.WARN_MARKER;
      bar = symbol.BAR;
      break;
    }
    case `danger`: {
      marker = symbol.DANGER_MARKER;
      bar = symbol.BAR;
      break;
    }
    case `quite`: {
      marker = ` `;
      bar = ` `;
      break;
    }
    case `activePromptHeader`: {
      marker = symbol.ACTIVE_PROMPT_MARKER;
      bar = symbol.ACTIVE_PROMPT_BAR;
      break;
    }
    case `activePromptLine`: {
      marker = symbol.ACTIVE_PROMPT_BAR;
      bar = symbol.ACTIVE_PROMPT_BAR;
      break;
    }
    case `activePromptTerminator`: {
      marker = symbol.ACTIVE_PROMPT_TERMINATOR;
      bar = ` `;
      break;
    }
    case `warnPromptHeader`: {
      marker = symbol.WARN_PROMPT_MARKER;
      bar = symbol.WARN_PROMPT_BAR;
      break;
    }
    case `warnPromptLine`: {
      marker = symbol.WARN_PROMPT_BAR;
      bar = symbol.WARN_PROMPT_BAR;
      break;
    }
    case `warnPromptTerminator`: {
      marker = symbol.WARN_PROMPT_TERMINATOR;
      bar = ` `;
      break;
    }
    case `terminatedPromptHeader`: {
      marker = symbol.TERMINATED_PROMPT_MARKER;
      bar = symbol.TERMINATED_PROMPT_BAR;
      break;
    }
    case `terminatedPromptLine`: {
      marker = symbol.TERMINATED_PROMPT_BAR;
      bar = symbol.TERMINATED_PROMPT_BAR;
      break;
    }
    case `terminatedPromptTerminator`: {
      marker = symbol.TERMINATED_PROMPT_TERMINATOR;
      bar = ` `;
      break;
    }
    case `completedPromptHeader`: {
      marker = symbol.COMPLETED_PROMPT_MARKER;
      bar = symbol.COMPLETED_PROMPT_BAR;
      break;
    }
    case `completedPromptLine`: {
      marker = symbol.COMPLETED_PROMPT_BAR;
      bar = symbol.COMPLETED_PROMPT_BAR;
      break;
    }
    case `completedPromptTerminator`: {
      marker = symbol.COMPLETED_PROMPT_TERMINATOR;
      bar = ` `;
      break;
    }
    case `clear`: {
      marker = ``;
      bar = ``;
      break;
    }
    default: {
      marker = opts?.marker ?? marker;
      bar = opts?.bar ?? bar;
    }
  }

  const lineWidth = stdout.screen.columns() - (marker || bar ? 3 : 0);
  let lines = text.split(`\n`);

  if (opts?.overflow === `word-wrap`) {
    lines = lines.flatMap((line) => {
      let safeLine = line.replaceAll(`\t`, `  `);
      const leftPadLength = stripAnsi(safeLine).replace(/\S.*$/, ``).length;
      const leftPad = ` `.repeat(leftPadLength);
      const leftPadReplace = `#`.repeat(leftPadLength);
      safeLine = safeLine.replace(leftPad, leftPadReplace);
      safeLine = wrapAnsi(safeLine, lineWidth, { hard: true, wordWrap: true });
      safeLine = safeLine.replace(leftPadReplace, leftPad);
      return safeLine.split(`\n`);
    });
  }
  else if (opts?.overflow === `hard-wrap`) {
    lines = lines.flatMap((line) => {
      let safeLine = wrapAnsi(line, lineWidth, { hard: true, trim: false, wordWrap: false });
      if (opts.hardReturnSymbol) {
        const hardReturnSymbol = typeof opts.hardReturnSymbol == `string` ? opts.hardReturnSymbol : c.dim.gray(`↩`);
        safeLine = safeLine.replaceAll(`\n`, `\n${hardReturnSymbol}`);
      }
      return safeLine.split(`\n`);
    });
  }
  else {
    lines = lines.map((line) => {
      return sliceAnsi(line, 0, lineWidth);
    });
  }

  if (marker || bar) {
    lines = lines.map((line, index) => {
      return index === 0 ? `${marker}  ${line}` : `${bar}  ${line}`;
    });
  }

  return lines;
}
