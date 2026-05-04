import type { LineDesc } from './LineDesc.ts';

export type LinesSummary = {
  lines: LineDesc[];
  minLength: number;
  maxLength: number;
};
