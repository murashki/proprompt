import * as sisteransi from './sisteransi.ts';

export const erase = {
  up: () => process.stdout.write(sisteransi.erase.up),
  down: () => process.stdout.write(sisteransi.erase.down),
  line: () => process.stdout.write(sisteransi.erase.line),
  lineEnd: () => process.stdout.write(sisteransi.erase.lineEnd),
  lineStart: () => process.stdout.write(sisteransi.erase.lineStart),
  prevLines: (count?: number) => process.stdout.write(sisteransi.erase.prevLines(count)),
  nextLines: (count?: number) => process.stdout.write(sisteransi.erase.nextLines(count)),
};
