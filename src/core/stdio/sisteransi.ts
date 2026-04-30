export const ESC = `\x1b`;
export const CSI = `${ESC}[`;
export const BEEP = `\u0007`;

export const cursor = {
  to: (y: null | number, x: null | number) => {
    if (y == null || x == null) {
      return cursor.up() + cursor.down(y ?? undefined) + cursor.backward() + cursor.forward(x ?? undefined);
    }
    return `${CSI}${Math.max(0, y) + 1};${Math.max(0, x) + 1}H`;
  },
  move: (y: null | number, x: null | number) => {
    let ret = ``;
    ret += cursor.down(y ?? undefined);
    ret += cursor.forward(x ?? undefined);
    return ret;
  },
  up: (count?: number): string => {
    if (count == null) {
      return `${CSI}${process.stdout.rows}A`;
    }
    if (count > 0) {
      return `${CSI}${count}A`;
    }
    if (count < 0) {
      return cursor.down( - count);
    }
    return ``;
  },
  down: (count?: number): string => {
    if (count == null) {
      return `${CSI}${process.stdout.rows}B`;
    }
    if (count > 0) {
      return `${CSI}${count}B`;
    }
    if (count < 0) {
      return cursor.up( - count);
    }
    return ``;
  },
  backward: (count?: number): string => {
    if (count == null) {
      return `${CSI}${process.stdout.columns}D`;
    }
    if (count > 0) {
      return `${CSI}${count}D`;
    }
    if (count < 0) {
      return cursor.forward( - count);
    }
    return ``;
  },
  forward: (count?: number): string => {
    if (count == null) {
      return `${CSI}${process.stdout.columns}C`;
    }
    if (count > 0) {
      return `${CSI}${count}C`;
    }
    if (count < 0) {
      return cursor.backward( - count);
    }
    return ``;
  },
  prevLine: (count?: number): string => {
    if (count == null) {
      return `${CSI}${process.stdout.rows}F`;
    }
    if (count > 0) {
      return `${CSI}${count}F`;
    }
    if (count < 0) {
      return cursor.nextLine( - count);
    }
    return cursor.line;
  },
  nextLine: (count?: number): string => {
    if (count == null) {
      return `${CSI}${process.stdout.rows}E`;
    }
    if (count > 0) {
      return `${CSI}${count}E`;
    }
    if (count < 0) {
      return cursor.prevLine(-count);
    }
    return cursor.line;
  },
  line: `${CSI}0G`,
  hide: `${CSI}?25l`,
  show: `${CSI}?25h`,
  save: `${ESC}7`,
  restore: `${ESC}8`,
};

export const erase = {
  up: `${CSI}1J`,
  down: `${CSI}0J`,
  line: `${CSI}2K`,
  lineEnd: `${CSI}0K`,
  lineStart: `${CSI}1K`,
  prevLines: (count?: number): string => {
    if (count == null) {
      return erase.prevLines(process.stdout.rows);
    }
    if (count < 0) {
      return erase.nextLines(-count);
    }
    if (count == 0) {
      return ``;
    }
    let clear = cursor.save + cursor.backward();
    for (let i = 0; i < count; i ++) {
      clear += erase.line + (i < count - 1 ? cursor.up(1) : ``);
    }
    return clear + `` + cursor.restore;
  },
  nextLines: (count?: number): string => {
    if (count == null) {
      return erase.nextLines(process.stdout.rows);
    }
    if (count < 0) {
      return erase.prevLines(-count);
    }
    if (count == 0) {
      return ``;
    }
    let clear = cursor.save + cursor.backward();
    for (let i = 0; i < count; i ++) {
      clear += erase.line + (i < count - 1 ? cursor.down(1) : ``);
    }
    return clear + `` + cursor.restore;
  },
};

export const screen = {
  erase: `\x1b[0J\x1b[1J`,
  clear: `\x1b[1;1H\x1b[0J`,
  shift: `\x1b[1;1H\x1b[2J`,
  altBufferEnter: `\x1b[?1049h`,
  altBufferLeave: `\x1b[?1049l`,
  enableWrapping: `\x1B[?7h`,
  disableWrapping: `\x1B[?7l`,
};

export const key = {
  esc: `\x1B`,

  delete: `\x7F`,
  backspace: `\x08`,

  enter: `\n`,
  return: `\r`,

  tab: `\t`,
  shiftTab: `\x1B[Z`,

  up: `\x1B[A`,
  down: `\x1B[B`,
  right: `\x1B[C`,
  left: `\x1B[D`,

  __shiftUp__: `\x1B[1;2A`,
  __shiftDown__: `\x1B[1;2B`,
  shiftRight: `\x1B[1;2C`,
  shiftLeft: `\x1B[1;2D`,

  ctrlA: `\x01`,
  ctrlB: `\x02`,
  ctrlC: `\x03`,
  ctrlD: `\x04`,
  ctrlE: `\x05`,
  ctrlF: `\x06`,
  ctrlG: `\x07`,
  __ctrlH__: `\x08`,
  __ctrlI__: `\x09`,
  __ctrlJ__: `\x0A`,
  ctrlK: `\x0B`,
  __ctrlL__: `\x0C`,
  __ctrlM__: `\x0D`,
  ctrlN: `\x0E`,
  ctrlO: `\x0F`,
  ctrlP: `\x10`,
  ctrlQ: `\x11`,
  ctrlR: `\x12`,
  ctrlS: `\x13`,
  ctrlT: `\x14`,
  ctrlU: `\x15`,
  ctrlV: `\x16`,
  ctrlW: `\x17`,
  ctrlX: `\x18`,
  ctrlY: `\x19`,
  ctrlZ: `\x1A`,
};

// \x1b[<n>A — Перемещает курсор на <n> строк вверх.
// \x1b[<n>B — Перемещает курсор на <n> строк вниз.
// \x1b[<n>C — Перемещает курсор на <n> столбцов вправо.
// \x1b[<n>D — Перемещает курсор на <n> столбцов влево.
// \x1b[<n>E — Перемещает курсор на <n> строк вниз и в начало строки.
// \x1b[<n>F — Перемещает курсор на <n> строк вверх и в начало строки.
// \x1b[<n>G — Перемещает курсор на <n>-й столбец текущей строки.
// \x1b[<row>H — Перемещает курсор на начало указанной строки.
// \x1b[<row>;<column>H — Переместить курсор на указанную строку и столбец.
// \x1b[0J — Отчищает экран от текущей позиции курсора до конца. Символ под курсором отчищается.
// \x1b[1J — Отчищает экран от начала до текущей позиции курсора. Символ под курсором отчищается.
// \x1b[2J — Отчищает весь экран. Позиция курсора остается в прежних координатах. Неочевидное
// поведение. В действительности прокручивает экран на сто процентов высоты. Таким образом любой
// контент оказывается за пределами экрана сверху.
// \x1b[0K — Отчищает текущую строку от курсора до конца. Символ под курсором отчищается.
// \x1b[1K — Отчищает текущую строку от начала до курсора. Символ под курсором отчищается.
// \x1b[2K — Отчищает всю текущую строку.
// \x1b[<n>L — Вставляет <n> пустых строк перед текущей строкой оставляя позицию курсора в прежних
//   координатах. Текущая строка и последующие опускаются вниз. Строка вышедшая за рамки окна снизу
//   исчезает насовсем.
// \x1b[<n>M — Удаляет <n> последующих строк начиная с текущей оставляя позицию курсора в прежних
//   координатах. Строки находившиеся ниже удаленных подымаются вверх.
// \x1b[<n>P — Удаляет в текущей строке <n> последующих символов начиная с текущего. Символы
// находившиеся правее удаленных сдвигаются влево.
// \x1b[<n>S — Вставляет <n> пустых строк снизу экрана оставляя позицию курсора в прежних
//   координатах. Существующие строки подымаются вверх. Строка вышедшая за рамки окна сверху
//   остается в прокрутке.
// \x1b[<n>T — Вставляет <n> пустых строк сверху экрана оставляя позицию курсора в прежних
//   координатах. Существующие строки опускаются вниз. Строка вышедшая за рамки окна снизу исчезает
//   насовсем.
// \x1b[<n>X — Очистить в текущей строке <n> последующих символов начиная с текущего.
// \x1b[s — Сохранить текущую позицию курсора.
// \x1b[u — Восстановить сохранённую позицию курсора.
// \x1b[?25l — Скрыть курсор.
// \x1b[?25h — Показать курсор.
// \x1b[?1049h — Включить альтернативный буфер.
// \x1b[?1049l — Выключить альтернативный буфер.

// require("ansi");
// require("ansicolor");
// require("cursor-pos");
