export type TextResult<
  TNullable extends boolean = false,
> = {
  canceled: boolean;
  terminated: boolean;
  value: TNullable extends true ? null | string : string;
};
