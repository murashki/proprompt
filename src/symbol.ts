import c from 'chalk';

export const SOFT_SUCCESS_SYMBOL = `○`;
export const SUCCESS_SYMBOL = `●`;
export const SOFT_INFO_SYMBOL = `◇`;
export const INFO_SYMBOL = `◆`;
export const SOFT_WARN_SYMBOL = `△`;
export const WARN_SYMBOL = `▲`;
export const SOFT_DANGER_SYMBOL = `□`;
export const DANGER_SYMBOL = `■`;

export const SOFT_SUCCESS_MARKER = c.green(SOFT_SUCCESS_SYMBOL);
export const SUCCESS_MARKER = c.green(SUCCESS_SYMBOL);
export const SOFT_INFO_MARKER = c.cyan(SOFT_INFO_SYMBOL);
export const INFO_MARKER = c.cyan(INFO_SYMBOL);
export const SOFT_WARN_MARKER = c.yellow(SOFT_WARN_SYMBOL);
export const WARN_MARKER = c.yellow(WARN_SYMBOL);
export const SOFT_DANGER_MARKER = c.red(SOFT_DANGER_SYMBOL);
export const DANGER_MARKER = c.red(DANGER_SYMBOL);

export const DIV = c.dim(`=`);
export const BAR = c.dim.gray(`╎`);
export const INTRO = c.cyan(`●`);
export const TIP = c.cyan(`●`);

export const ACTIVE_PROMPT_MARKER = c.cyan(`■`);
export const ACTIVE_PROMPT_BAR = c.dim.gray(`╎`);
export const ACTIVE_PROMPT_TERMINATOR = c.dim.gray(`╎`);

export const COMPLETED_PROMPT_MARKER = c.green(`■`);
export const COMPLETED_PROMPT_BAR = c.dim.gray(`╎`);
export const COMPLETED_PROMPT_TERMINATOR = c.dim.gray(`╎`);

export const WARN_PROMPT_MARKER = c.red(`■`);
export const WARN_PROMPT_BAR = c.dim.gray(`╎`);
export const WARN_PROMPT_TERMINATOR = c.dim.gray(`╎`);

export const CANCELED_PROMPT_MARKER = c.yellow(`■`);
export const CANCELED_PROMPT_BAR = c.dim.gray(`╎`);
export const CANCELED_PROMPT_TERMINATOR = ` `;

export const TERMINATED_PROMPT_MARKER = c.red(`■`);
export const TERMINATED_PROMPT_BAR = c.dim.gray(`╎`);
export const TERMINATED_PROMPT_TERMINATOR = ` `;

export const OPTION_MARKER = c.dim(`○`);
export const ACTIVE_OPTION_MARKER = c.cyan(`●`);

export const LEFT = `◀`;
export const RIGHT = `▶`;
export const UP = `▲`;
export const DOWN = `▼`;

export const DASH = `╌`;
export const VERTICAL_DASH = `╎`;

export const TABLE_BORDER = {
  L0011: c.dim(`┐`),
  L0101: c.dim(`─`),
  L0110: c.dim(`┌`),
  L0111: c.dim(`┬`),
  L1001: c.dim(`┘`),
  L1010: c.dim(`│`),
  L1011: c.dim(`┤`),
  L1100: c.dim(`└`),
  L1101: c.dim(`┴`),
  L1110: c.dim(`├`),
  L1111: c.dim(`┼`),
};

/*
  - Текст
  = Многострочный текст
  # Число
  $ Время
  @ Дата
 */

/*
  $ Текст
  @ Многострочный текст
  # Число
  T Время
  D Дата
 */
