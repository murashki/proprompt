export class TerminatedByEsc extends Error {
  key: null | string;

  constructor(key?: string) {
    super(key ? `${key} terminated by "Esc"` : `Terminated by "Esc"`);
    this.key = key ?? null;
  }
}
