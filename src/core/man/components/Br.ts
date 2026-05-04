import type { BrElement } from './@types/BrElement.ts';

export function Br(): BrElement {
  return {
    type: `br`,
    compile: (width: number) => {
      return [` `.repeat(width)];
    },
  };
}
