export function setClipboard(value: string) {
  (process.env as any).__PROPROMPTS__CLIPBOARD = value;
}

export function getClipboard() {
  return (process.env as any).__PROPROMPTS__CLIPBOARD;
}

export function clearClipboard() {
  delete (process.env as any).__PROPROMPTS__CLIPBOARD;
}
