import type { LineDesc } from './index.ts';

export type LinesSummary = {
  lines: LineDesc[];
  minLength: number;
  maxLength: number;
};
