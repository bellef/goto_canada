export const filterParams = ({ location, category }, filtCategory, filtLocation) => {
  if (filtLocation) {
    if (filtCategory)
      return (category == filtCategory && location == filtLocation)
    else
      return (location == filtLocation)
  }
  else {
    return true
  }
}

export const onlyUnique = (value, index, self) => self.indexOf(value) === index
