/**
 * A user-defined type guard to check if a value is a string.
 * @param  value - The value to check.
 * @return `true` when the value is a string.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
