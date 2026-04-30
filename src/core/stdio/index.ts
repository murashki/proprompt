import { beep } from './beep.ts';
import { createListener } from './createListener.ts';
import { cursor } from './cursor.ts';
import { erase } from './erase.ts';
import { screen  } from './screen.ts';
import * as sisteransi from './sisteransi.ts';

export * from './@types/index.ts';

export { sisteransi };

export const stdout = {
  beep,
  cursor,
  erase,
  screen,
  write: process.stdout.write.bind(process.stdout),
  addListener: process.stdout.addListener.bind(process.stdout),
  removeListener: process.stdout.removeListener.bind(process.stdout),
};

export const stdin = {
  createListener,
  key: sisteransi.key,
  setRawMode: process.stdin.setRawMode.bind(process.stdin),
  resume: process.stdin.resume.bind(process.stdin),
  pause: process.stdin.pause.bind(process.stdin),
};
