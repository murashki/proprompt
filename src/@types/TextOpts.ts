import type { TextValidationHint } from './index.ts';

export type TextOpts<
  TNullable extends boolean = false,
> = {
  blinkInterval?: number;
  canceledMessage?: string;
  hints?: string[];
  // Not implemented yet
  history?:
    | boolean
    | {
      size?: number;
      removeDuplicates?: boolean;
      removeConsecutiveDuplicates?: boolean;
      filePath?: boolean;
    };
  initialValue?: null | string;
  maxLength?: number;
  message: string;
  name?: string;
  nullable?: TNullable;
  // Not implemented yet
  predefinedVariants?: string[];
  printDefaultHelpText?: boolean;
  printNullableHint?: boolean;
  terminatedMessage?: string;
  throwOnCtrlC?: boolean;
  throwOnEsc?: boolean;
  validate?: (value: TNullable extends true ? null | string : string) => void | undefined | null | string[] | TextValidationHint[];
  width?: number;
};
