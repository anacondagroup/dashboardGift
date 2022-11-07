export const transformNullableStringValue = {
  output: (value: string | null): string => value ?? '',
  input: (value: string): string | null => value?.trimLeft() || null,
} as const;
