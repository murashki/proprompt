import c from 'chalk';
import type { Page } from './core/man/index.ts';
import { Br } from './core/man/index.ts';
import { DescriptionList } from './core/man/index.ts';
import { H1 } from './core/man/index.ts';
import { H2 } from './core/man/index.ts';
import { hotKey } from './core/man/index.ts';
import { Text } from './core/man/index.ts';
import { Tips } from './core/man/index.ts';
import { stdout } from './index.ts';

export function getManPage(): Page {
  return {
    content: [
      stdout.screen.rows() > 30 ? Br() : null,
      H1({
        content: `Text prompt help`,
      }),
      Br(),
      H2({
        content: `Text Editing`,
        paddingLeft: 2,
      }),
      Br(),
      Text({
        content: `Use the arrow keys to navigate through the text. These shortcuts are also available:`,
        paddingLeft: 2,
      }),
      Br(),
      DescriptionList({
        list: [
          {
            term: `${hotKey(`Shift + Left`)}`,
            details: `Move cursor to the start of the line.`,
          },
          {
            term: `${hotKey(`Shift + Right`)}`,
            details: `Move cursor to the end of the line.`,
          },
          {
            term: `${hotKey(`Ctrl + Q`)}`,
            details: `Enter quick actions mode.`,
          },
        ],
        paddingLeft: 2,
      }),
      Br(),
      Br(),
      H2({
        content: `Quick Actions`,
        paddingLeft: 2,
      }),
      Br(),
      Text({
        content: `To enter quick actions mode, press ${hotKey(`Ctrl + Q`)}. Once you're in this mode, you will have access to these shortcuts:`,
        paddingLeft: 2,
      }),
      Br(),
      DescriptionList({
        list: [
          {
            term: `${hotKey(`Q`)} or ${hotKey(`Esc`)}`,
            details: `Exit quick actions mode.`,
          },
          {
            term: `${hotKey(`H`)}`,
            details: `Open this help.`,
          },
          {
            term: `${hotKey(`S`, true)}`,
            details: `Enter text selection mode.`,
          },
          {
            term: `${hotKey(`N`, true)}`,
            details: `Set the value to null if the field is nullable.`,
          },
          {
            term: `${hotKey(`A`, true)}`,
            details: `Select entire text and switch to text selection mode.`,
          },
          {
            term: `${hotKey(`D`, true)} or ${hotKey(`Delete`, true)}`,
            details: `Delete entire text.`,
          },
          {
            term: `${hotKey(`C`, true)}`,
            details: `Copy entire text.`,
          },
          {
            term: `${hotKey(`X`, true)}`,
            details: `Cut entire text.`,
          },
          {
            term: `${hotKey(`V`, true)}`,
            details: `Paste previously copied text.`,
          },
        ],
        paddingLeft: 2,
      }),
      Br(),
      Br(),
      H2({
        content: `Text Selection`,
        paddingLeft: 2,
      }),
      Br(),
      Text({
        content: `To start selecting text, press ${hotKey(`Ctrl + Q`)} and then ${hotKey(`S`)}. This will put you into text selection mode. Once you're in this mode, use the arrow keys to select text. These shortcuts are also available:`,
        paddingLeft: 2,
      }),
      Br(),
      DescriptionList({
        list: [
          {
            term: `${hotKey(`Q`)} or ${hotKey(`Esc`)}`,
            details: `Exit text selection mode.`,
          },
          {
            term: `${hotKey(`Shift + Left`)}`,
            details: `Select text from the cursor to the start of the line.`,
          },
          {
            term: `${hotKey(`Shift + Right`)}`,
            details: `Select text from the cursor to the end of the line.`,
          },
          {
            term: `${hotKey(`A`)}`,
            details: `Select entire text.`,
          },
          {
            term: `${hotKey(`D`)} or ${hotKey(`Delete`)}`,
            details: `Delete selected text and resume editing.`,
          },
          {
            term: `${hotKey(`C`)}`,
            details: `Copy selected text and resume editing.`,
          },
          {
            term: `${hotKey(`X`)}`,
            details: `Cut selected text and resume editing.`,
          },
        ],
        paddingLeft: 2,
      }),
      Br(),
      Br(),
      H2({
        content: `Tips`,
        paddingLeft: 2,
      }),
      Br(),
      Tips({
        list: [`The shortcuts shown in ${c.green(`green`)} are ready to use right now.`],
        paddingLeft: 2,
      }),
    ],
  };
}
