import { testCommand } from '../testCommand.ts';

const command = `\x1b[0D`;

export const notice = [`unobvious-zero`];

const start = `
1
2
3
4
1234
`;

const position = `5;5`;

const result = `
1
2
3
4
123█
`;

await testCommand(start, position, command, result);
