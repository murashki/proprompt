import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import type { SingleColumnMatrixOpts } from './@types/SingleColumnMatrixOpts.ts';
import { padAround } from './core/tools/padAround.ts';
import { padEnd } from './core/tools/padEnd.ts';
import { padStart } from './core/tools/padStart.ts';

export function compileSingleColumnMatrix(opts: SingleColumnMatrixOpts): string[] {
  const lines = opts.lines.flatMap((line) => line.split(`\n`));
  const leftGapWidth = opts.startWith ? stripAnsi(opts.startWith).length : 0;
  const rightGapWidth = opts.endWith ? stripAnsi(opts.endWith).length : 0;
  const width = (opts.width ?? lines.reduce((acc, line) => Math.max(acc, stripAnsi(line).length), 0)) - leftGapWidth - rightGapWidth;

  return lines
    .flatMap((line) => {
      if (opts.contentOverflow === `word-wrap`) {
        return wrapAnsi(line, width, { hard: true, wordWrap: true }).split(`\n`);
      }
      else if (opts.contentOverflow === `hard-wrap`) {
        return wrapAnsi(line, width, { hard: true, wordWrap: false }).split(`\n`);
      }
      else {
        return sliceAnsi(line, 0, width);
      }
    })
    .map((line) => {
      if (opts.contentAlign === `align-right`) {
        return padStart(line, width);
      }
      else if (opts.contentAlign === `align-center`) {
        return padAround(line, width);
      }
      else {
        return padEnd(line, width);
      }
    })
    .map((line) => {
      return (opts.startWith ?? ``) + line + (opts.endWith ?? ``);
    });
}
