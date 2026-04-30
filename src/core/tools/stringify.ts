import c from 'chalk';
import type { StringifyProps } from './index.ts';

export function stringify(value: any, props?: StringifyProps): string {
  return stringifyRecursive(value, props);
}

function stringifyRecursive(value: any, props?: StringifyProps): string {
  const string = props?.specialValues?.(value);
  if (string == null) {
    if (value == null) {
      return stringifyNullOrUndefined(value, props?.primitivesUppercase);
    }
    else if (typeof value === `boolean`) {
      return stringifyBoolean(value, props?.primitivesUppercase);
    }
    else if (typeof value === `number`) {
      return stringifyNumberOrBigint(value);
    }
    else if (typeof value === `bigint`) {
      return stringifyNumberOrBigint(value);
    }
    else if (typeof value === `symbol`) {
      return stringifySymbol(value);
    }
    else if (typeof value === `string`) {
      return stringifyString(value);
    }
    else if (typeof value === `function`) {
      return stringifyFunction(value);
    }
    else if (Array.isArray(value)) {
      return stringifyArray(value, props);
    }
    else if (value instanceof Date) {
      return stringifyDate(value);
    }
    else {
      return stringifyObject(value, props);
    }
  }
  else {
    return string;
  }
}

export function stringifyNullOrUndefined(value: null | undefined, primitivesUppercase?: boolean): string {
  return c.yellow(primitivesUppercase ? String(value).toUpperCase() : String(value));
}

export function stringifyBoolean(value: boolean, primitivesUppercase?: boolean): string {
  return c.yellow(primitivesUppercase ? String(value).toUpperCase() : String(value));
}

export function stringifyNumberOrBigint(value: number | bigint): string {
  return c.yellow(String(value));
}

export function stringifySymbol(value: symbol) {
  return c.gray(`Symbol[${String(value)}]`);
}

export function stringifyString(value: string) {
  return `${c.dim(`"`)}${value.split(`\n`).map((line) => c.green(line)).join(c.dim(`\\n`))}${c.dim(`"`)}`;
}

export function stringifyFunction(value: () => any) {
  return c.gray(`Function[${value.name}]`);
}

export function stringifyArray(value: any[], props?: StringifyProps): string {
  const depth = props?.depth ?? 1;
  const innerIndent = props?.innerIndent ?? 0;

  if ( ! depth) {
    return c.gray(`[...]`);
  }
  else if ( ! value.length) {
    return c.gray(`[]`);
  }
  else {
    if (props?.inline) {
      const lines = value.map((value) => {
        return `${stringifyRecursive(value, { ...props, depth: depth - 1, innerIndent: 0 })}`;
      });
      const content = lines.join(`${c.gray(`,`)} `);
      return `${c.gray(`[`)}${content}${c.gray(`]`)}`;
    }
    else {
      const lines = value.map((value) => {
        return `${i(innerIndent + 1)}${stringifyRecursive(value, { ...props, depth: depth - 1, innerIndent: innerIndent + 1 })}`;
      });
      const content = lines.join(`${c.gray(`,`)}\n`);
      return `${c.gray(`[`)}\n${content}\n${i(innerIndent)}${c.gray(`]`)}`;
    }
  }
}

export function stringifyObject(value: Record<any, any>, props?: StringifyProps): string {
  const depth = props?.depth ?? 1;
  const innerIndent = props?.innerIndent ?? 0;

  if ( ! depth) {
    return c.gray(`{...}`);
  }
  else {
    const keys = Object.getOwnPropertyNames(value);
    if ( ! keys.length) {
      return c.gray(`{}`);
    }
    else {
      if (props?.inline) {
        const lines = keys.map((key) => {
          return `${key}${c.gray(`:`)} ${stringifyRecursive(value[key], { ...props, depth: depth - 1, innerIndent: 0 })}`;
        });
        const content = lines.join(`${c.gray(`,`)} `);
        return `${c.gray(`{`)}${content}${c.gray(`}`)}`;
      }
      else {
        const lines = keys.map((key) => {
          return `${i(innerIndent + 1)}${key}${c.gray(`:`)} ${stringifyRecursive(value[key], { ...props, depth: depth - 1, innerIndent: innerIndent + 1 })}`;
        });
        const content = lines.join(`${c.gray(`,`)}\n`);
        return `${c.gray(`{`)}\n${content}\n${i(innerIndent)}${c.gray(`}`)}`;
      }
    }
  }
}

export function stringifyDate(value: Date) {
  return c.yellow(value.toISOString());
}

// Indentation
function i(indent: number = 0) {
  return `  `.repeat(indent);
}
