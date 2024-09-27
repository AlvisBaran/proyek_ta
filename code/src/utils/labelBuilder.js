const defaultResponse = '-'
export const labelBuilder = {
  User: value => (!!value ? `${value.displayName} - ${value.email}` : defaultResponse),
  Bank: value =>
    !!value ? `${value.swiftCode} - ${value.name}${!!value.alias ? ` (${value.alias})` : ''}` : defaultResponse
}
