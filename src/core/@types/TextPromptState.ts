export type TextPromptState = {
  value: string;
  cursor: number;
  cursorInverse: boolean;
  selection: null | number[];
  shift: number;
  text: string;
};
