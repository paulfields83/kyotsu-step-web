export function isNumbersZipUnit(unitId: string) {
  return /^math-numbers-expressions-(?:n(?:0[1-9]|1[0-4])|ne0[12])$/.test(unitId)
}
