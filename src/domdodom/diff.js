const change = (dfrom, dto, ifrom, ito) => {
  return {
    deleteFrom: dfrom,
    deleteTo: dto,
    insertFrom: ifrom,
    insertTo: ito
  }
}

const findMatch = (eq, current, next) => {
  let i
  let j
  for (i = 0; i < current.length; i++) {
    let done = false
    for (j = 0; j < next.length; j++) {
      if (eq(current[i], next[j])) {
        done = true
        break
      }
    }

    if (done) {
      break
    }
  }

  return {current: i, next: j}
}

const findNoMatch = (eq, current, next) => {
  let i
  for (i = 0; i < current.length && i < next.length; i++) {
    if (!eq(current[i], next[i])) {
      break
    }
  }

  return i
}

// eq doesn't need to be commutative
// current and next must be an array
// next or its items don't need to be of the same type as list
export const changeSet = (eq, current, next) => {
  const changes = []

  let index = {current: 0, next: 0}
  let match
  let noMatch
  for (;;) {
    if (index.current === current.length || index.next === next.length) {
      if (index.current < current.length || index.next < next.length) {
        changes.push(change(
          index.current,
          current.length,
          index.next,
          next.length
        ))
      }

      return changes
    }

    match = findMatch(eq, current.slice(index.current), next.slice(index.next))
    if (match.current > 0 || match.next > 0) {
      changes.push(change(
        index.current,
        index.current + match.current,
        index.next,
        index.next + match.next)
      )
    }

    index.current += match.current
    index.next += match.next

    noMatch = findNoMatch(eq, current.slice(index.current), next.slice(index.next))
    index.current += noMatch
    index.next += noMatch
  }
}

// remove and insert are allowed to mutate the list, their result is returned
// nextList must be an array
// nextList or its items don't need to be of the same type as list
export const applyChangeSet = (remove, insert, list, nextList, changeSet) => {
  let c
  let offset = 0
  for (c of changeSet) {
    if (c.deleteFrom !== c.deleteTo) {
      list = remove(list, c.deleteFrom + offset, c.deleteTo + offset)
      offset += c.deleteFrom - c.deleteTo
    }

    if (c.insertFrom !== c.insertTo) {
      list = insert(list, c.deleteTo + offset, nextList.slice(c.insertFrom, c.insertTo))
      offset += c.insertTo - c.insertFrom
    }
  }

  return list
}

// current and next must be iterable
export const getUnchanged = (current, next, changeSet) => {
  current = [...current]
  next = [...next]
  changeSet.forEach(c => {
    current.splice(c.deleteFrom, c.deleteTo - c.deleteFrom)
    next.splice(c.insertFrom, c.insertTo - c.insertFrom)
  })

  return {current: current, next: next}
}

// eq doesn't need to be commutative
// remove and insert are allowed to mutate the list, their result is returned
// list and nextList must be an array
// nextList or its items don't need to be of the same type as list
export const applyDiff = (eq, remove, insert, list, nextList) => {
  const c = changeSet(eq, list, nextList)
  return applyChangeSet(remove, insert, list, nextList, c)
}
