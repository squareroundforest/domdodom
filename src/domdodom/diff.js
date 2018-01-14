const change = (dfrom, dto, ifrom, ito) => {
  return {
    deleteFrom: dfrom,
    deleteTo: dto,
    insertFrom: ifrom,
    insertTo: ito
  }
}

const findMatch = (eq, prev, next) => {
  let i
  let j
  for (i = 0; i < prev.length; i++) {
    let done
    for (j = 0; j < next.length; j++) {
      if (eq(prev[i], next[j])) {
        done = true
        break
      }
    }

    if (done) {
      break
    }
  }

  return {prev: i, next: j}
}

const findNoMatch = (eq, prev, next) => {
  let i
  for (i = 0; i < prev.length && i < next.length; i++) {
    if (!eq(prev[i], next[i])) {
      break
    }
  }

  return i
}

export const changeSet = (eq, prev, next) => {
  const changes = []

  if (!Array.isArray(prev)) {
    prev = Array.from(prev)
  }

  if (!Array.isArray(next)) {
    next = Array.from(next)
  }

  let index = {prev: 0, next: 0}
  let match
  let noMatch
  for (;;) {
    if (index.prev === prev.length || index.next === next.length) {
      if (index.prev < prev.length || index.next < next.length) {
        changes.push(change(
          index.prev,
          prev.length,
          index.next,
          next.length
        ))
      }

      return changes
    }

    match = findMatch(eq, prev.slice(index.prev), next.slice(index.next))
    if (match.prev > 0 || match.next > 0) {
      changes.push(change(
        index.prev,
        index.prev + match.prev,
        index.next,
        index.next + match.next)
      )
    }

    index.prev += match.prev
    index.next += match.next

    noMatch = findNoMatch(eq, prev.slice(index.prev), next.slice(index.next))
    index.prev += noMatch
    index.next += noMatch
  }
}

export const applyChangeSet = (remove, insert, changeSet, list, nextList) => {
  if (!Array.isArray(nextList)) {
    nextList = Array.from(nextList)
  }

  let i
  let c
  let offset = 0
  for (i = 0; i < changeSet.length; i++) {
    c = changeSet[i]

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

// eq needs not to be commutative
// remove and insert are allowed to mutate the list, their result is returned
// list and next must be array-like or iterable
// nextList or its items don't need to be of the same type as list
export const applyDiff = (eq, remove, insert, list, nextList) => {
  const c = changeSet(eq, list, nextList)
  return applyChangeSet(remove, insert, c, list, nextList)
}
