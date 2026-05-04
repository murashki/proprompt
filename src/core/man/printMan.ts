import { stdin } from '../stdio/index.ts';
import { stdout } from '../stdio/index.ts';
import type { Man } from './@types/Man.ts';
import type { GetManPage } from './@types/GetManPage.ts';
import { bottomHelp } from './bottomHelp.ts';

export function printMan(getManPage: GetManPage): Man {
  type State = {
    scroll: number;
    screenHeight: number;
    pageHeight: number;
    contentHeight: number;
  };

  let state: State = {
    scroll: 0,
    screenHeight: 0,
    pageHeight: 0,
    contentHeight: 0,
  };

  const render = (update?: Partial<State>) => {
    state = {
      ...state,
      ...update,
    };

    const help = bottomHelp().map((line) => (line));

    const page = getManPage();

    const contentLines = [
      ...page.content.flatMap((element) => {
        return (
          element === null
            ? []
            : typeof element === `string`
              ? element.split(`\n`)
              : element.compile(stdout.screen.columns() - 2)
        ).map((line) => `  ` + line);
      }),
      ` `.repeat(stdout.screen.columns()),
    ];

    state.screenHeight = stdout.screen.rows();
    state.pageHeight = Math.max(0, state.screenHeight - help.length);
    state.contentHeight = contentLines.length;

    const contentLinesToPrint = contentLines.slice(state.scroll, state.scroll + state.pageHeight);

    const linesToPrint = Array(state.screenHeight).fill(` `.repeat(stdout.screen.columns()));
    linesToPrint.splice(0, contentLinesToPrint.length, ...contentLinesToPrint);
    linesToPrint.splice(state.pageHeight, help.length, ...help);
    stdout.cursor.to(0, 0);
    stdout.write(linesToPrint.join(`\n`));
  };

  const onData = (data: Buffer) => {
    const key = data.toString();

    const maxScroll = Math.max(0, state.contentHeight - state.pageHeight);

    if (key === stdin.key.left) {
      render({ scroll: Math.max(0, state.scroll - state.pageHeight) });
    }
    else if (key === stdin.key.right) {
      render({ scroll: Math.min(Math.max(state.scroll, maxScroll), state.scroll + state.pageHeight) });
    }
    else if (key === stdin.key.up) {
      render({ scroll: Math.max(0, state.scroll - 1) });
    }
    else if (key === stdin.key.down) {
      render({ scroll: Math.min(Math.max(state.scroll, maxScroll), state.scroll + 1) });
    }
    else if (key === stdin.key.shiftLeft) {
      render({ scroll: 0 });
    }
    else if (key === stdin.key.shiftRight) {
      render({ scroll: Math.max(state.scroll, maxScroll) });
    }
  };

  const onResize = () => {
    stdout.screen.erase();
    render();
  };

  const listener = stdin.createListener();
  listener.on(`data`, onData);

  listener.listen();
  stdout.screen.altBufferEnter();
  stdout.screen.disableWrapping();
  process.addListener(`SIGWINCH`, onResize);

  render();

  return {
    end: () => {
      process.removeListener(`SIGWINCH`, onResize);
      stdout.screen.altBufferLeave();
      listener.end();
    },
  };
}
