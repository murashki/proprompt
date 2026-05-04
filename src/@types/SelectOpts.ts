import type { SelectContentOverflow } from './SelectContentOverflow.ts';
import type { SelectOption } from './SelectOption.ts';
import type { SelectValidationHint } from './SelectValidationHint.ts';

export type SelectOpts<
  TValue extends any = any,
  TNullable extends boolean = false,
> = {
  canceledMessage?: string;
  contentOverflow?: SelectContentOverflow;
  hints?: string[];
  initialValue?: null | TValue;
  maxHeight?: number;
  message: string;
  name?: string;
  nullable?: TNullable;
  options: SelectOption<TValue>[];
  printDefaultHelpText?: boolean;
  printNullableHint?: boolean;
  terminatedMessage?: string;
  throwOnCtrlC?: boolean;
  throwOnEsc?: boolean;
  validate?: (value: TNullable extends true ? null | TValue : TValue) => void | undefined | null | string[] | SelectValidationHint[];
  width?: number;
};
