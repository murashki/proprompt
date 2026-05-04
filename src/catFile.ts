import fs from 'node:fs';
import c from 'chalk';
import { format } from 'date-fns/format';
import { stdout } from './index.ts';
import type { CatFileOpts } from './index.ts';
import { line } from './index.ts';

/**
 * Возвращает:
 *   true - Если логи успешно напечатаны
 *   false - Файл не удалось открыть
 *
 * Добавляет отступ в конце.
 */
export async function catFile(filePath: string, opts?: CatFileOpts): Promise<boolean> {
  if ( ! fs.existsSync(filePath)) {
    await line(`File not found: ${filePath}`, { as: `warning` });
    return false;
  }

  await line(c.dim(`File: ${filePath}`));

  let fileContent = fs.readFileSync(filePath, { encoding: `utf8` });
  const lines = fileContent.split(`\n`);

  if (opts?.printFileStat ?? true) {
    const modifiedAt = fs.statSync(filePath);
    await line(c.dim(`Size: ${bytesToString(modifiedAt.size)} (lines count: ${lines.length})`));
    await line(c.dim(`Modified at: ${format(modifiedAt.mtime, `yyyy.MM.dd HH:mm:ss XXX`)}`));
    const datetime = format(new Date(), `yyyy.MM.dd HH:mm:ss XXX`);
    await line(c.dim(`Current time: ${datetime}`));
  }

  if ( ! fileContent) {
    await line(c.dim(`File is empty`));
    await line(``);
  }
  else {
    if (opts?.fileFormatter === `env`) {
      fileContent = formatEnvLines(lines).join(`\n`);
    }
    if (opts?.lineCommentPrefix) {
      fileContent = commentLines(lines, opts.lineCommentPrefix).join(`\n`);
    }

    const startText = `Start of file`;
    const endText = `End of file`;
    let lineWidth = lines.reduce((acc, line) => {
      return line.length > acc ? line.length : acc;
    }, 0) + 1;
    lineWidth = Math.min(lineWidth, stdout.screen.columns());
    const startTextShift = Math.floor(Math.max(0, (lineWidth - startText.length)) / 2);
    const startLeftTextShift = Math.floor(startTextShift / 2);
    const startRightTextShift = Math.ceil(startTextShift / 2);
    const endTextShift = Math.floor(Math.max(0, (lineWidth - endText.length)) / 2);
    const endLeftTextShift = Math.floor(endTextShift / 2);
    const endRightTextShift = Math.ceil(endTextShift / 2);
    const startDiv = c.gray(`~ `.repeat(startLeftTextShift)) + startText + c.gray(` ~`.repeat(startRightTextShift));
    const endDiv = c.gray(`~ `.repeat(endLeftTextShift)) + endText + c.gray(` ~`.repeat(endRightTextShift));
    // const DIV_LENGTH = 7;
    // const startDiv = c.gray(`~ `.repeat(DIV_LENGTH)) + startText + c.gray(` ~`.repeat(DIV_LENGTH));
    // const endDiv = c.gray(`~ `.repeat(DIV_LENGTH)) + endText + c.gray(` ~`.repeat(DIV_LENGTH + 1));

    await line(``, { as: `clear` });
    await line(c.dim(startDiv), { as: `clear` });
    await line(fileContent, { as: `clear` });
    await line(c.dim(endDiv), { as: `clear` });
    await line(``, { as: `clear` });
  }

  return true;
}

function commentLines(lines: string[], lineCommentPrefix: string[]): string[] {
  return lineCommentPrefix.reduce((lines, commentPrefix) => {
    return lines.map((line) => {
      if (line.startsWith(commentPrefix)) {
        return c.dim(line);
      }
      else {
        return line;
      }
    });
  }, lines);
}

function formatEnvLines(lines: string[]): string[] {
  return lines.map((line) => {
    let formattedLine = line;
    if (formattedLine.startsWith(`# --`) && formattedLine.endsWith(`--`)) {
      formattedLine = formattedLine.replaceAll(/^# -- (.+) --$/g, `${c.dim(`# --`)} ${c.bold.yellow(`$1`)} ${c.dim(`--`)}`);
    }
    else if (formattedLine.startsWith(`# --`)) {
      formattedLine = formattedLine.replaceAll(/^# -- (.+)$/g, `${c.dim(`# --`)} ${c.italic.yellow(`$1`)}`);
    }
    else if (formattedLine.startsWith(`#`)) {
      formattedLine = c.dim(formattedLine);
    }
    else {
      formattedLine = formattedLine.replaceAll(/^([^=]+)=(.+)$/g, `$1${c.dim(`=`)}${c.green(`$2`)}`);
    }
    return formattedLine;
  });
}

function bytesToString(bytes: number) {
  if (bytes === 0) {
    return '0b';
  }

  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const value = (bytes / Math.pow(k, i)).toFixed(2);

  return `${value} ${sizes[i]}`;
}
