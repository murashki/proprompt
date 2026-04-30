import stripAnsi from 'strip-ansi';

export function padEnd(text: string, width: number) {
  const length = stripAnsi(text).length;
  return text + ` `.repeat(Math.max(0, width - length));
}
