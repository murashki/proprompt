import c from 'chalk';
import type { ExceptionOpts } from './@types/ExceptionOpts.ts';
import { line } from './line.ts';

export async function exception(error: unknown, opts?: ExceptionOpts) {
  const message = opts?.message || `An error occurred:`;

  const text = error && typeof error === `object` && `stack` in error && error.stack
    ? (error as Error).stack
    : String(error);

  await line(c.red(message), { as: `danger` });
  await line(``, { as: `clear` });
  await line(c.red(text), { as: `clear`, hardReturnSymbol: true, overflow: `hard-wrap` });
  await line(``, { as: `clear` });
}
