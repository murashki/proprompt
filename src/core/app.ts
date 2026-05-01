import { stdin } from './index.ts';
import { stdout } from './index.ts';

export function enterDirectTerminalManipulation() {
  stdin.setRawMode(true);
  stdin.resume();
  stdout.screen.disableWrapping();
  stdout.cursor.hide();
}

export function exitDirectTerminalManipulation() {
  stdout.cursor.show();
  stdout.screen.enableWrapping();
  stdin.pause();
  stdin.setRawMode(false);
}
