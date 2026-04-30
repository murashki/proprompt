export function diffLine(a: string | string[], b: string | string[]) {
  if (a !== b) {
    const aLines = typeof a === `string` ? a.split('\n') : a;
    const bLines = typeof b === `string` ? b.split('\n') : b;

    for (let i = 0; i < Math.max(aLines.length, bLines.length); i ++) {
      if (aLines[i] !== bLines[i]) {
        return i;
      }
    }

    return null;
  }

  return null;
}
