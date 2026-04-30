export type H2Element = {
  type: `h2`,
  content: string;
  paddingLeft?: number;
  compile: (width: number) => string[];
};
