import stripAnsi from 'strip-ansi';
import type { LinesSummary } from './index.ts';

export function inspectLines(rawLines: string[]): LinesSummary {
  let minLength = Infinity;
  let maxLength = 0;

  const lines = rawLines.map((text) => {
    const cleanText = stripAnsi(text);
    minLength = Math.min(minLength, cleanText.length);
    maxLength = Math.max(maxLength, cleanText.length);

    return {
      text,
      cleanText,
    };
  });

  return {
    lines,
    minLength,
    maxLength,
  };
}
