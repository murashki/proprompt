import * as sisteransi from './sisteransi.ts';

export const screen = {
  erase: () => process.stdout.write(sisteransi.screen.erase),
  clear: () => process.stdout.write(sisteransi.screen.clear),
  shift: () => process.stdout.write(sisteransi.screen.shift),
  altBufferEnter: () => process.stdout.write(sisteransi.screen.altBufferEnter),
  altBufferLeave: () => process.stdout.write(sisteransi.screen.altBufferLeave),
  disableWrapping: () => process.stdout.write(sisteransi.screen.disableWrapping),
  enableWrapping: () => process.stdout.write(sisteransi.screen.enableWrapping),
  columns: () => process.stdout.columns,
  rows: () => process.stdout.rows,
};
