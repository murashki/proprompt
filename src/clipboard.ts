export function setClipboard(value: string) {
  (process.env as any).__PROPROMPT__CLIPBOARD__ = value;
}

export function getClipboard() {
  return (process.env as any).__PROPROMPT__CLIPBOARD__;
}

export function clearClipboard() {
  delete (process.env as any).__PROPROMPT__CLIPBOARD__;
}
