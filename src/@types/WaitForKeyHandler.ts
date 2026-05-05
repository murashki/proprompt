export type WaitForKeyHandler = {
  resolve: () => void;
  resolved: boolean;
  resolvedKey: null | string;
  onResolve: null | ((key: null | string) => void);
};
