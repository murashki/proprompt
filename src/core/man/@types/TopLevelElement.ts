import type { BrElement } from '../components/index.ts';
import type { DescriptionListElement } from '../components/index.ts';
import type { H1Element } from '../components/index.ts';
import type { H2Element } from '../components/index.ts';
import type { TextElement } from '../components/index.ts';
import type { TipsElement } from '../components/index.ts';

export type TopLevelElement =
  | BrElement
  | DescriptionListElement
  | H1Element
  | H2Element
  | TextElement
  | TipsElement;
