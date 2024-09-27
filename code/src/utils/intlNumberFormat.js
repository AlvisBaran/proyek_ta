export function intlNumberFormat(value, zeroReturnNumber) {
  if (value === null) return ''
  if (isNaN(Number(value))) return ''

  if (Number(value) === 0 && !zeroReturnNumber) return ''

  return new Intl.NumberFormat('ID').format(Number(value))
}
