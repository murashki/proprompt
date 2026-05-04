export type TextPromptOpts = {
  initialValue?: string;
  initialCursor?: number;
  initialCursorInverse?: boolean;
  initialSelection?: null | number[];
  initialShift?: number;
  maxLength?: number;
  width?: number;
  blinkInterval?: number;
};
