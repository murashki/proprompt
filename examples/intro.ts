// npx tsx --tsconfig ./tsconfig.json ./examples/intro.ts

import { enterDirectTerminalManipulation } from '../src/index.ts';
import { exitDirectTerminalManipulation } from '../src/index.ts';
import { intro } from '../src/index.ts';

enterDirectTerminalManipulation();
await intro(`Common`);
await intro(`Success`, { as: `success` });
await intro(`Warning`, { as: `warning` });
await intro(`Danger`, { as: `danger` });
exitDirectTerminalManipulation();
