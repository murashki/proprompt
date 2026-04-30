import { testCommand } from '../testCommand.ts';

const command = `\x1b[1J`;

export const notice = [`void-under-cursor`];

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



   █56
523456
623456
`;

await testCommand(start, position, command, result);
