import type { TopLevelElement } from './index.ts';

export type Page = {
  content: (null | string | TopLevelElement)[];
};
