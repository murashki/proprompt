import { testCommand } from '../testCommand.ts';

const command = `\x1b[2D`;

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
12█4
`;

await testCommand(start, position, command, result);
