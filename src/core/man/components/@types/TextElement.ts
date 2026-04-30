export type TextElement = {
  type: `text`,
  content: string;
  paddingLeft?: number;
  compile: (width: number) => string[];
};
