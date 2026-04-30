import * as sisteransi from './sisteransi.ts';

export const cursor = {
  to: (y: null | number, x: null | number) => process.stdout.write(sisteransi.cursor.to(y, x)),
  move: (y: number, x: number) => process.stdout.write(sisteransi.cursor.move(y, x)),
  up: (count?: number) => process.stdout.write(sisteransi.cursor.up(count)),
  down: (count?: number) => process.stdout.write(sisteransi.cursor.down(count)),
  backward: (count?: number) => process.stdout.write(sisteransi.cursor.backward(count)),
  forward: (count?: number) => process.stdout.write(sisteransi.cursor.forward(count)),
  prevLine: (count?: number) => process.stdout.write(sisteransi.cursor.prevLine(count)),
  nextLine: (count?: number) => process.stdout.write(sisteransi.cursor.nextLine(count)),
  line: () => process.stdout.write(sisteransi.cursor.line),
  hide: () => process.stdout.write(sisteransi.cursor.hide),
  show: () => process.stdout.write(sisteransi.cursor.show),
  save: () => process.stdout.write(sisteransi.cursor.save),
  restore: () => process.stdout.write(sisteransi.cursor.restore),
};
