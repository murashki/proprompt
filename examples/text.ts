import { enterDirectTerminalManipulation } from '../src/index.ts';
import { exitDirectTerminalManipulation } from '../src/index.ts';
import { text } from '../src/index.ts';

enterDirectTerminalManipulation();
const textResult = await text({ message: 'Enter name' });
console.log(textResult);
exitDirectTerminalManipulation();
