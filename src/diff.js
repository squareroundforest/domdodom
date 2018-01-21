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

// [[deleteFrom, deleteTo, insertFrom, insertTo], ...]
export const changeSet = (eq, current, next) => {
  const changes = []

  let index = {current: 0, next: 0}
  let match
  let noMatch
  for (;;) {
    if (index.current === current.length || index.next === next.length) {
      if (index.current < current.length || index.next < next.length) {
        changes.push([
          index.current,
          current.length,
          index.next,
          next.length
        ])
      }

      return changes
    }

    match = findMatch(eq, current.slice(index.current), next.slice(index.next))
    if (match.current > 0 || match.next > 0) {
      changes.push([
        index.current,
        index.current + match.current,
        index.next,
        index.next + match.next
      ])
    }

    index.current += match.current
    index.next += match.next

    noMatch = findNoMatch(eq, current.slice(index.current), next.slice(index.next))
    index.current += noMatch
    index.next += noMatch
  }
}

export const forEachUnchanged = (current, next, changeSet, proc) => {
  let currentFrom = 0
  let nextFrom = 0
  for (let c of changeSet) {
    if (c[0] > currentFrom || c[2] > nextFrom) {
      for (let i = currentFrom; i < c[0]; i++) {
        proc(current[i], next[i + nextFrom - currentFrom])
      }
    }

    currentFrom = c[1]
    nextFrom = c[3]
  }

  if (current.length > currentFrom || next.length > nextFrom) {
    for (let i = currentFrom; i < current.length; i++) {
      proc(current[i], next[i + nextFrom - currentFrom])
    }
  }
}

export const applyChangeSet = (remove, insert, list, nextList, changeSet) => {
  let offset = 0
  for (let c of changeSet) {
    if (c[0] !== c[1]) {
      list = remove(list, c[0] + offset, c[1] + offset)
      offset += c[0] - c[1]
    }

    if (c[2] !== c[3]) {
      list = insert(list, c[1] + offset, nextList.slice(c[2], c[3]))
      offset += c[3] - c[2]
    }
  }

  return list
}

export const applyDiff = (eq, remove, insert, list, nextList) => {
  const c = changeSet(eq, list, nextList)
  return applyChangeSet(remove, insert, list, nextList, c)
}
