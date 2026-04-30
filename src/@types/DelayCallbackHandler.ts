export type DelayCallbackHandler = {
  resolve: () => void;
  resolved: boolean;
  onResolve: null | (() => void);
};
