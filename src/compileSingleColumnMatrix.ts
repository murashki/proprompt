import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import type { SingleColumnMatrixProps } from './index.ts';
import { padAround } from './index.ts';
import { padEnd } from './index.ts';
import { padStart } from './index.ts';

export function compileSingleColumnMatrix(props: SingleColumnMatrixProps): string[] {
  const lines = props.lines.flatMap((line) => line.split(`\n`));
  const leftGapWidth = props.startWith ? stripAnsi(props.startWith).length : 0;
  const rightGapWidth = props.endWith ? stripAnsi(props.endWith).length : 0;
  const width = (props.width ?? lines.reduce((acc, line) => Math.max(acc, stripAnsi(line).length), 0)) - leftGapWidth - rightGapWidth;

  return lines
    .flatMap((line) => {
      if (props.contentOverflow === `word-wrap`) {
        return wrapAnsi(line, width, { hard: true, wordWrap: true }).split(`\n`);
      }
      else if (props.contentOverflow === `hard-wrap`) {
        return wrapAnsi(line, width, { hard: true, wordWrap: false }).split(`\n`);
      }
      else {
        return sliceAnsi(line, 0, width);
      }
    })
    .map((line) => {
      if (props.contentAlign === `align-right`) {
        return padStart(line, width);
      }
      else if (props.contentAlign === `align-center`) {
        return padAround(line, width);
      }
      else {
        return padEnd(line, width);
      }
    })
    .map((line) => {
      return (props.startWith ?? ``) + line + (props.endWith ?? ``);
    });
}
