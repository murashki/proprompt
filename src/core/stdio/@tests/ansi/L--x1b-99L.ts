import { testCommand } from '../testCommand.ts';

// TODO Строки пропадают на совсем!

const command = `\x1b[99L`;

const start = `
123456
223456
323456
423456
523456
623456
`;

const position = `4;4`;

const result = `
123456
223456
323456
   █
`;

await testCommand(start, position, command, result);
