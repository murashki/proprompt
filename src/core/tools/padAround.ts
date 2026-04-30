import stripAnsi from 'strip-ansi';

export function padAround(text: string, width: number) {
  const length = stripAnsi(text).length;
  const pad = Math.max(0, width - length);
  const padStart = Math.floor(pad / 2);
  const padEnd = pad - padStart;
  return ` `.repeat(padStart) + text + ` `.repeat(padEnd);
}
