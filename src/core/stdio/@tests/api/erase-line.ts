import * as sisteransi from '../../sisteransi.ts';
import { testCommand } from '../testCommand.ts';

const command = () => sisteransi.erase.line;

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
523456
623456
`;

await testCommand(start, position, command, result);
