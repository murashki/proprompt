import stripAnsi from 'strip-ansi';

export function padStart(text: string, width: number) {
  const length = stripAnsi(text).length;
  return ` `.repeat(Math.max(0, width - length)) + text;
}
