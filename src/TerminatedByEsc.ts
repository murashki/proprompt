export class TerminatedByEsc extends Error {
  processName: null | string;

  constructor(processName?: string) {
    super(processName ? `${processName} terminated by "Esc"` : `Terminated by "Esc"`);
    this.processName = processName ?? null;
  }
}
