import * as sisteransi from '../../sisteransi.ts';
import { testCommand } from '../testCommand.ts';

const command = () => sisteransi.cursor.backward(-99);

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
1234                                   █
`;

await testCommand(start, position, command, result);
