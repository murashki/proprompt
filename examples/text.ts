import { appEnd } from '../src/index.ts';
import { appStart } from '../src/index.ts';
import { text } from '../src/index.ts';

appStart();
const textResult = await text({ message: 'Enter name' });
console.log(textResult);
appEnd();
