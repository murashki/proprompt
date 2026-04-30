import { testCommand } from '../testCommand.ts';

const command = `\x1b[D`;

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
