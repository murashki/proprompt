import c from 'chalk';

export const hotKey = (key: string, active?: boolean) => active ? c.bold.green(`"${key}"`) : c.bold(`"${key}"`);
