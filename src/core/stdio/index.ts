import { beep } from './beep.ts';
import { createListener } from './createListener.ts';
import { cursor } from './cursor.ts';
import { erase } from './erase.ts';
import { screen  } from './screen.ts';
import * as sisteransi from './sisteransi.ts';

export * from './@types/index.ts';

export { sisteransi };

export const stdin = {
  createListener,
  key: sisteransi.key,
  setRawMode: (...args: Parameters<typeof process.stdin.setRawMode>) => process.stdin.setRawMode(...args),
  resume: (...args: Parameters<typeof process.stdin.resume>) => process.stdin.resume(...args),
  pause: (...args: Parameters<typeof process.stdin.pause>) => process.stdin.pause(...args),
};

export const stdout = {
  beep,
  cursor,
  erase,
  screen,
  write: (...args: Parameters<typeof process.stdout.write>) => process.stdout.write(...args),
  addListener: (...args: Parameters<typeof process.stdout.addListener>) => process.stdout.addListener(...args),
  removeListener: (...args: Parameters<typeof process.stdout.removeListener>) => process.stdout.removeListener(...args),
};
