import { testCommand } from '../testCommand.ts';

const command = `\x1b[2M`;

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
623█56
`;

await testCommand(start, position, command, result);
