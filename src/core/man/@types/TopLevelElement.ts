import type { BrElement } from '../components/@types/BrElement.ts';
import type { DescriptionListElement } from '../components/@types/DescriptionListElement.ts';
import type { H1Element } from '../components/@types/H1Element.ts';
import type { H2Element } from '../components/@types/H2Element.ts';
import type { TextElement } from '../components/@types/TextElement.ts';
import type { TipsElement } from '../components/@types/TipsElement.ts';

export type TopLevelElement =
  | BrElement
  | DescriptionListElement
  | H1Element
  | H2Element
  | TextElement
  | TipsElement;
