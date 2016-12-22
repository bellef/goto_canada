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

export const sanitizeItem = (item) => {
  return {
    location:     item.location,
    category:     getHumanReadableCategory(item.category),
    code:         item.code,
    quota:        getIntFromString(item.quota),
    first:        item.first,
    second:       item.second,
    invitations:  getIntFromString(item.invitations),
    candidates:   getIntFromString(item.candidates),
    spots:        getIntFromString(item.spots),
    chances:      getIntFromString(item.chances)
  }
}

const getHumanReadableCategory = (cat) => {
  switch(cat) {
    case 'coop':
      return 'Stage coop'
    case 'wh':
      return 'PVT'
    case 'yp':
      return 'JP'
  }
}

const getIntFromString = (str) => {
  return parseInt(str.replace(/\s/g, ''))
}