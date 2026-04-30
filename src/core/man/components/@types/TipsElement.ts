export type TipsElement = {
  type: `tips`,
  list: string[];
  paddingLeft?: number;
  compile: (width: number) => string[];
};
