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
        content: `Select prompt help`,
      }),
      Br(),
      H2({
        content: `Option Selection`,
        paddingLeft: 2,
      }),
      Br(),
      Text({
        content: `Use the arrow keys to navigate through the options. These shortcuts are also available:`,
        paddingLeft: 2,
      }),
      Br(),
      DescriptionList({
        list: [
          {
            term: `${hotKey(`Left`)}`,
            details: `Jump to the first option.`,
          },
          {
            term: `${hotKey(`Right`)}`,
            details: `Jump to the last option.`,
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
            term: `${hotKey(`N`, true)}`,
            details: `Set the value to null if the field is nullable.`,
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
