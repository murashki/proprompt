export type StringifyProps = {
  depth?: number;
  inline?: boolean;
  innerIndent?: number;
  primitivesUppercase?: boolean;
  specialValues?: (value: any) => null | string;
};
