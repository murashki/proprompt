import fs from 'node:fs';
import c from 'chalk';
import { format } from 'date-fns/format';
import type { MonitorFileOpts } from './index.ts';
import { MONITOR_FILE_REFRESH_INTERVAL } from './index.ts';
import { cancel } from './index.ts';
import { createWriter } from './index.ts';
import { delay } from './index.ts';
import { getLines } from './index.ts';
import { line } from './index.ts';
import { message } from './index.ts';
import { select } from './index.ts';
import { stdin } from './index.ts';
import { terminate } from './index.ts';
import { TerminatedByCtrlC } from './index.ts';
import { waitForKey } from './index.ts';

/**
 * Выводит пустую строку в конце.
 */
export async function monitorFile(filePath: string, opts?: MonitorFileOpts): Promise<void> {
  if ( ! fs.existsSync(filePath)) {
    await message(`File not found: ${filePath}`, { as: `warning` });
    return;
  }

  let lineCount = opts?.lineCount ?? 0;

  if ( ! opts?.lineCount) {
    const lineCountSelectResult = await select({
      message: `Number of lines to monitor`,
      options: [
        { value: 5, label: `5` },
        { value: 10, label: `10` },
        { value: 15, label: `15` },
        { value: 20, label: `20` },
        { value: 30, label: `30` },
        { value: 50, label: `50` },
      ],
    });

    if (lineCountSelectResult.canceled) {
      return;
    }
    else {
      lineCount = lineCountSelectResult.value;
    }
  }

  const writer = createWriter();

  async function print(content: string) {
    const lines = getLines(c.dim(`File: ${filePath}`));

    if (opts?.printFileStat ?? true) {
      const stats = fs.statSync(filePath);
      const datetime = format(new Date(), `yyyy.MM.dd HH:mm:ss XXX`);
      lines.push(...getLines(c.dim(`Modified at: ${format(stats.mtime, `yyyy.MM.dd HH:mm:ss XXX`)}`)));
      lines.push(...getLines(c.dim(`Current time: ${datetime}`)));
    }

    lines.push(...getLines(`\n` + content + `\n`));
    lines.push(...getLines(c.dim(`Press "Esc" to exit log monitor`)));

    await writer.write({ lines, animateInitial: true });
  }

  const key = await waitForKey([stdin.key.ctrlC, stdin.key.esc], async (keyListenerControl) => {
    while (true) {
      const content = getFileLastLines(filePath, lineCount);
      await print(content);

      if (keyListenerControl.resolved) {
        break;
      }
      else {
        await delay(MONITOR_FILE_REFRESH_INTERVAL, (delayControl) => {
          keyListenerControl.onResolve = delayControl.resolve;
        });

        if (keyListenerControl.resolved) {
          break;
        }
      }
    }
  });

  await writer.end(true);
  await line(``);

  if (key === stdin.key.ctrlC) {
    await terminate();
    throw new TerminatedByCtrlC(`File Monitor`);
  }
  else {
    await cancel();
  }
}

function getFileLastLines(filePath: string, linesCount: number) {
  return [
    ...Array(linesCount).fill(``),
    ...fs.readFileSync(filePath, { encoding: `utf8` }).trim().split(`\n`)
  ]
    .slice( - linesCount)
    .join(`\n`);
}
