export function nbsp(text: string): string {
  return text.replaceAll(` `, `\u202F`);
}
