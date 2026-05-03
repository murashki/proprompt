export class TerminatedByCtrlC extends Error {
  processName: null | string;

  constructor(processName?: string) {
    super(processName ? `${processName} terminated by "Ctrl + C"` : `Terminated by "Ctrl + C"`);
    this.processName = processName ?? null;
  }
}
