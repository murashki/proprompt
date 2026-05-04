import childProcess from 'node:child_process';
import { withResolvers } from './core/tools/withResolvers.ts';
import { message } from './index.ts';

export async function exec(command: string) {
  const { promise, resolve, reject } = withResolvers<string>();

  await message(`Exec command: ${command}`, { as: `warning` });

  childProcess.exec(command, (error, stdout, stderr) => {
    if (error) {
      reject(error);
    }
    else if (stderr) {
      reject(error);
    }
    else {
      resolve(stdout);
    }
  });

  return promise;
}
