import stripAnsi from 'strip-ansi';
import type { Resolvers } from './tools/withResolvers.ts';
import { withResolvers } from './tools/withResolvers.ts';
import type { WriterTask } from './index.ts';
import { diffLine } from './index.ts';
import { padEnd } from './index.ts';
import { stdout } from './index.ts';
import { WRITER_DELAY_DECREMENT_STEP } from './index.ts';
import { WRITER_SECOND_LINE_PRINT_DELAY } from './index.ts';

export function createWriter() {
  let prevLines: string[] = [];
  let resolvers: null | Resolvers = null;
  let ended = false;

  return {
    write: async (task: WriterTask) => {
      if (ended) {
        throw new Error(`The writer was previously ended`);
      }

      const prevResolvers = resolvers;
      const currentResolvers = resolvers = withResolvers();
      if (prevResolvers && ! prevResolvers.resolved) {
        await prevResolvers.promise;
      }

      const diff = diffLine(task.lines, prevLines);
      if (diff != null) {
        stdout.cursor.nextLine(diff);

        const safetyLines = getSafetyLines(prevLines.slice(diff), task.lines.slice(diff));

        if (task.animate || task.animateInitial && ! prevResolvers) {
          await printAnimated(safetyLines);
        }
        else {
          stdout.write(safetyLines.join(`\n`) + `\n`);
        }

        stdout.cursor.prevLine(Math.max(task.lines.length, prevLines.length));
      }

      prevLines = task.lines;
      currentResolvers.resolve();
    },
    end: async (releaseCursor?: boolean) => {
      ended = true;
      if (resolvers && ! resolvers.resolved) {
        await resolvers.promise;
      }
      if (releaseCursor ?? true) {
        stdout.cursor.nextLine(prevLines.length);
      }
    },
  };
}

export async function write(lines: string[], animate?: boolean) {
  if (animate) {
    await printAnimated(lines);
  }
  else {
    stdout.write(lines.join(`\n`) + `\n`);
  }
}

let lastCallCompleteDatetime = Date.now();
let lastCallTimeout = WRITER_SECOND_LINE_PRINT_DELAY;
async function printAnimated(lines: string[]) {
  const { promise, resolve } = withResolvers();

  lastCallTimeout = Math.max(lastCallTimeout, Math.min(Date.now() - lastCallCompleteDatetime, WRITER_SECOND_LINE_PRINT_DELAY));

  const print = (lineIndex: number) => {
    if (lineIndex <= lines.length - 1) {
      if (lastCallTimeout > 0) {
        setTimeout(() => {
          stdout.write(lines[lineIndex] + `\n`);
          print(lineIndex + 1);
        }, lastCallTimeout = Math.max(0, lastCallTimeout - WRITER_DELAY_DECREMENT_STEP));
      }
      else {
        stdout.write(lines.slice(lineIndex).join(`\n`) + `\n`);
        resolve();
      }
    }
    else {
      resolve();
    }
  };

  stdout.write(lines[0] + `\n`);
  print(1);
  await promise;
  lastCallCompleteDatetime = Date.now();
}

function getSafetyLines(prevLines: string[], nextLines: string[]): string[] {
  const safetyLines = [...nextLines, ...Array(Math.max(0, prevLines.length - nextLines.length)).fill(``)];

  return safetyLines.map((line, index) => {
    if (index >= prevLines.length) {
      return line;
    }
    else {
      return padEnd(line, stripAnsi(prevLines[index].trimEnd()).length);
    }
  });
}
