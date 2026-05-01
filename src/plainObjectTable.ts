import c from 'chalk';
import { message } from './index.ts';
import { table } from './index.ts';

export async function plainObjectTable(rows: Record<string, any>[]) {
  if ( ! rows.length) {
    await message(`No records found`, { as: `warning` });
    return;
  }

  const columnNames = [...rows.reduce((columnNames, row) => {
    Object.keys(row).forEach((rowPropertyName) => {
      columnNames.add(rowPropertyName);
    });
    return columnNames;
  }, new Set<string>()) as Set<string>];

  const columns = columnNames.map((columnName) => {
    return {
      title: columnName,
      render: (item: any) => {
        const value = item[columnName];
        if (value == null || typeof value === `boolean`) {
          return c.yellow(String(value));
        }
        else if (typeof value === `number` || typeof value === `bigint`) {
          return c.yellow(String(value));
        }
        else if (typeof value === `string`) {
          return `${c.dim(`"`)}${c.green(value)}${c.dim(`"`)}`;
        }
        else if (typeof value === `symbol`) {
          return c.cyan(`[[${String(value)}]]`);
        }
        else if (typeof value === `function`) {
          return c.cyan(`[[Function]]`);
        }
        else if (Array.isArray(value)) {
          return c.cyan(`[[Array]]`);
        }
        else {
          return c.cyan(`[[Object]]`);
        }
      },
    };
  });

  await table({ animate: true, columns, data: rows });

  await message(c.dim(`${rows.length} records are displayed`));
}
