import type { BrElement } from './index.ts';

export function Br(): BrElement {
  return {
    type: `br`,
    compile: (width: number) => {
      return [` `.repeat(width)];
    },
  };
}
