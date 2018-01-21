// TODO: enough to use an array
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

const getUnchanged = (changeSet, currentLength, nextLength) => {
  const unchanged = []
  const block = [0, 0, 0, 0]
  for (let c of changeSet) {
    if (c.deleteFrom > block[0] || c.insertFrom > block[2]) {
      block[1] = c.deleteFrom
      block[3] = c.insertFrom
      unchanged.push([...block])
    }

    block[0] = c.deleteTo
    block[2] = c.insertTo
  }

  if (currentLength > block[0] || nextLength > block[2]) {
    block[1] = currentLength
    block[3] = nextLength
    unchanged.push([...block])
  }

  return unchanged.map(u => {
    return {
      currentFrom: u[0],
      currentTo: u[1],
      nextFrom: u[2],
      nextTo: u[3]
    }
  })
}

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

export const applyChangeSet = (remove, insert, list, nextList, changeSet) => {
  let offset = 0
  for (let c of changeSet) {
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

export const forEachUnchanged = (current, next, changeSet, proc) => {
  // TODO: simplify, no need for the separate getUnchanged function
  const unchanged = getUnchanged(changeSet, current.length, next.length)
  for (let c of unchanged) {
    for (let i = c.currentFrom; i < c.currentTo; i++) {
      proc(current[i], next[i + c.nextFrom - c.currentFrom])
    }
  }
}

export const applyDiff = (eq, remove, insert, list, nextList) => {
  const c = changeSet(eq, list, nextList)
  return applyChangeSet(remove, insert, list, nextList, c)
}
