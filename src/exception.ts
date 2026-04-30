import c from 'chalk';
import type { ExceptionProps } from './index.ts';
import { line } from './index.ts';

export async function exception(error: unknown, props?: ExceptionProps) {
  const message = props?.message || `An error occurred:`;

  const text = error && typeof error === `object` && `stack` in error && error.stack
    ? (error as Error).stack
    : String(error);

  await line(c.red(message), { as: `danger` });
  await line(``, { as: `clear` });
  await line(c.red(text), { as: `clear`, hardReturnSymbol: true, overflow: `hard-wrap` });
  await line(``, { as: `clear` });
}
