// npx tsx --tsconfig ./tsconfig.json ./examples/text.ts

import { enterDirectTerminalManipulation } from '../src/index.ts';
import { exitDirectTerminalManipulation } from '../src/index.ts';
import { text } from '../src/index.ts';

enterDirectTerminalManipulation();
const textResult = await text({ message: 'Enter name' });
console.log(textResult);
exitDirectTerminalManipulation();
