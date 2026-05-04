import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { withResolvers } from './core/tools/withResolvers.ts';
import type { EditFileOpts } from './index.ts';
import { enterDirectTerminalManipulation } from './index.ts';
import { exitDirectTerminalManipulation } from './index.ts';
import { message } from './index.ts';

/**
 * Возвращает:
 *   void - Файл не удалось отредактировать файл
 *   string - Если файл успешно отредактирован
 *
 * Добавляет пустую линию в конце, если что-то выводит
 */
export async function editFile(filePath: string, opts?: EditFileOpts): Promise<void | string> {
  if (opts?.temporary) {
    if ( ! fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, opts?.content ?? ``, `utf8`);
    }
  }
  else {
    if ( ! fs.existsSync(filePath)) {
      await message(`File not found: ${filePath}`, { as: `warning` });
      return;
    }
  }

  const { promise, resolve, reject} = withResolvers<string>();

  enterDirectTerminalManipulation();
  const editor = spawn(`nano`, [filePath], { stdio: `inherit` });

  editor.on(`close`, (code) => {
    if (code === 0) {
      const content = fs.readFileSync(filePath, `utf8`);
      if (opts?.temporary) {
        fs.unlinkSync(filePath);
      }
      resolve(content);
    }
    else {
      reject(code);
    }
    exitDirectTerminalManipulation();
  });

  return promise;
}
