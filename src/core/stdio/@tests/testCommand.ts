import type { Resolvers } from '../../tools/@types/Resolvers.ts';
import { withResolvers } from '../../tools/withResolvers.ts';

const prompt = `Set terminal to 40×12 (w×h) for testing\n\n`;

export async function testCommand(start: string, position: string, command: string | (() => string), result: string) {
  let resolvers: null | Resolvers = null;

  const onData = (data: Buffer) => {
    if ((data.toString() === ` ` || data.toString() === `\r`) && resolvers && ! resolvers.resolved) {
      resolvers.resolve();
    }
    if (data.toString() === `\x03`) {
      process.stdout.write(`\x1b[?25h`);
      process.stdin.write(`\x1b[${process.stdout.rows};0H`);
      process.exit(1);
    }
  };

  const userAction = async () => {
    resolvers = withResolvers();
    await resolvers.promise;
  };

  process.stdin.resume();
  process.stdin.setRawMode(true);
  process.stdin.addListener(`data`, onData);

  process.stdout.write(`\x1b[2J`);
  process.stdout.write(`\x1b[1;1H`);
  process.stdout.write(prompt);
  process.stdout.write(start.replace(/^\n/, ``).replace(/\n$/, ``));
  process.stdout.write(`\x1b[${position}H`);
  await userAction();

  process.stdout.write(typeof command === `string` ? command : command());
  await userAction();

  process.stdout.write(`\x1b[?25l`);

  process.stdout.write(`\x1b[2J`);
  process.stdout.write(`\x1b[1;1H`);
  process.stdout.write(prompt);
  process.stdout.write(result.replace(/^\n/, ``).replace(/\n$/, ``));
  await userAction();

  process.stdin.write(`\x1b[${process.stdout.rows};0H`);
  process.stdout.write(`\x1b[?25h`);

  process.stdin.removeListener(`data`, onData);
  process.stdin.setRawMode(false);
  process.stdin.pause();
}
