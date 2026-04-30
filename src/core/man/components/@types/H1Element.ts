export type H1Element = {
  type: `h1`,
  content: string;
  paddingLeft?: number;
  compile: (width: number) => string[];
};
