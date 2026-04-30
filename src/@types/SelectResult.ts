export type SelectResult<
  TValue extends any = any,
  TNullable extends boolean = false,
> = {
  canceled: boolean;
  terminated: boolean;
  value: TNullable extends true ? null | TValue : TValue;
};
