export default function assertDefined<T>(
  value: T | undefined,
  valueName = "Value"
): T {
  if (value === undefined) {
    throw new Error(
      `\u001b[0;31mEnvironment variable ${valueName} is undefined\u001b[0m`
    );
  }
  return value;
}
