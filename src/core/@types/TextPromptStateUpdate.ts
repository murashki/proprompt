export type TextPromptStateUpdate = {
  value?: string;
  cursor?: number;
  cursorInverse?: boolean;
  selection?: null | number[];
  shift?: number;
};
