import type { TableOpts } from './@types/TableOpts.ts';
import { write } from './core/writer.ts';
import { tableSplit } from './tableSplit.ts';

export async function table<
  TTableItem extends Record<string, any> = Record<string, any>,
>(opts: TableOpts<TTableItem>) {
  const { animate, ...restOpts } = opts;
  const lines = tableSplit(restOpts);
  await write(lines, animate ?? true);
}
