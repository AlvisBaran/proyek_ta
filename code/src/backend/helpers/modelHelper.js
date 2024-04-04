export const removeUndefined = data => {
  Object.keys(data).forEach(key => data[key] === undefined && delete data[key])
  return data
}
