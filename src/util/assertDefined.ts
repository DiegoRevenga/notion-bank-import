import errorColor from "./errorColor";

export default function assertDefined<T>(
  value: T | undefined,
  valueName = "Value"
): T {
  if (value === undefined) {
    throw new Error(
      errorColor(`Environment variable ${valueName} is undefined`)
    );
  }
  return value;
}
