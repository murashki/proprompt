import type { TopLevelElement } from './TopLevelElement.ts';

export type Page = {
  content: (null | string | TopLevelElement)[];
};
