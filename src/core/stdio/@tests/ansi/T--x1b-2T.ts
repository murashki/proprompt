import { testCommand } from '../testCommand.ts';

const command = `\x1b[2T`;

export const notice = [`unobvious-zero`];

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
223█56
323456
423456
523456
623456
`;

await testCommand(start, position, command, result);
