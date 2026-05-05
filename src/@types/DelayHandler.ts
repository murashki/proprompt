export type DelayHandler = {
  resolve: () => void;
  resolved: boolean;
  onResolve: null | (() => void);
};
