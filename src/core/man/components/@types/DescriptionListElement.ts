import type { DescriptionLine } from './DescriptionLine.ts';

export type DescriptionListElement = {
  type: `description-list`,
  list: DescriptionLine[];
  paddingLeft?: number;
  compile: (width: number) => string[];
};
