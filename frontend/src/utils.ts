export function findTargetValueInArray(
  array: any[],
  key: string,
  value: any,
  target: string
) {
  const result = array.find((item) => item[key] === value);

  return result?.[target];
}
