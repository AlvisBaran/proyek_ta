export function generateFormData(data) {
  const formData = new FormData()

  const dataValue = Object.values(data)
  const dataKeys = Object.keys(data)

  for (let i = 0; i < dataValue.length; i++) {
    if (dataValue[i]) {
      formData.append(dataKeys[i], String(dataValue[i]))
    }
  }

  return formData
}

export const stringIncludeArray = (text, listWords) => {
  let found = false
  listWords.forEach(word => {
    if (text.includes(word)) found = true
  })
  return found
}

export const randomBgColor = () => {
  let colors = [
    'red',
    'blue',
    'green',
    'lightgray',
    'lightgreen',
    'black',
    'purple',
    'pink',
    'primary.main',
    'secondary.main'
  ]
  let minimum = 0
  let maximum = colors.length - 1
  return colors[Math.floor(Math.random() * (maximum - minimum + 1)) + minimum]
}
