export class TerminatedByCtrlC extends Error {
  key: null | string;

  constructor(key?: string) {
    super(key ? `${key} terminated by "Ctrl + C"` : `Terminated by "Ctrl + C"`);
    this.key = key ?? null;
  }
}
