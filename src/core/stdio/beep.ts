import * as sisteransi from './sisteransi.ts';

export const beep = () => {
  process.stdout.write(sisteransi.BEEP);
};
