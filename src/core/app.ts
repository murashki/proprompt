import { stdin } from './index.ts';
import { stdout } from './index.ts';

export function appStart() {
  stdin.setRawMode(true);
  stdin.resume();
  stdout.screen.disableWrapping();
  stdout.cursor.hide();
}

export function appEnd() {
  stdout.cursor.show();
  stdout.screen.enableWrapping();
  stdin.pause();
  stdin.setRawMode(false);
}
