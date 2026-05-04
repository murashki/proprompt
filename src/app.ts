import { stdin } from './core/stdio/index.ts';
import { stdout } from './core/stdio/index.ts';

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
