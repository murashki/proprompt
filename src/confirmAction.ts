import { text } from './text.ts';

/**
 * Возвращает:
 * true - Есть успешно подтвердили действие
 * false - Если действие не подтверждено
 */
export async function confirmAction(actionName: string, validateString: string) {
  const textResult = await text({
    message: `You are going to ${actionName}. Type "${validateString}", to confirm.`,
    validate: (value) => value === validateString ? undefined : [`Type "${validateString}" to ${actionName}`],
  });

  return ! textResult.canceled;
}
