/* global test expect */

import {getChanges, syncChanges, forEachUnchanged, sync} from './sync'

const insert = (a, at, items) => {
  a.splice(at, 0, ...items)
  return a
}

const remove = (a, start, end) => {
  a.splice(start, end - start)
  return a
}

const testGetChanges = (title, from, to, expected) => test('change set: ' + title, () => {
  expect(getChanges(Object.is, from, to)).toEqual(expected)
})

const testSyncChanges = (title, from, next) => test('apply: ' + title, () => {
  const c = getChanges(Object.is, from, next)
  expect(syncChanges(insert, remove, from, next, c)).toEqual(next)
})

testGetChanges('both empty', [], [], [])
testGetChanges('to empty', [1, 2, 3], [], [[0, 3, 0, 0]])
testGetChanges('from empty', [], [1, 2, 3], [[0, 0, 0, 3]])
testGetChanges('unchanged', [1, 2, 3], [1, 2, 3], [])
testGetChanges('prepend', [-1, 0, 1, 2, 3], [1, 2, 3], [[0, 2, 0, 0]])
testGetChanges('insert', [1, 2, 2.3, 2.6, 3], [1, 2, 3], [[2, 4, 2, 2]])
testGetChanges('append', [1, 2, 3, 4, 5], [1, 2, 3], [[3, 5, 3, 3]])
testGetChanges('prepend, insert', [-1, 0, 1, 2, 2.3, 2.6, 3], [1, 2, 3], [[0, 2, 0, 0], [4, 6, 2, 2]])
testGetChanges('prepend, append', [-1, 0, 1, 2, 3, 4, 5], [1, 2, 3], [[0, 2, 0, 0], [5, 7, 3, 3]])
testGetChanges('insert, append', [1, 2, 2.3, 2.6, 3, 4, 5], [1, 2, 3], [[2, 4, 2, 2], [5, 7, 3, 3]])
testGetChanges('prepend, insert, append', [-1, 0, 1, 2, 2.3, 2.6, 3, 4, 5], [1, 2, 3],
  [[0, 2, 0, 0], [4, 6, 2, 2], [7, 9, 3, 3]])
testGetChanges('remove start', [1, 2, 3], [-1, 0, 1, 2, 3], [[0, 0, 0, 2]])
testGetChanges('remove middle', [1, 2, 3], [1, 1.3, 1.6, 2, 3], [[1, 1, 1, 3]])
testGetChanges('remove end', [1, 2, 3], [1, 2, 3, 4, 5], [[3, 3, 3, 5]])
testGetChanges('remove start, middle', [1, 2, 3], [-1, 0, 1, 1.3, 1.6, 2, 3], [[0, 0, 0, 2], [1, 1, 3, 5]])
testGetChanges('remove start, end', [1, 2, 3], [-1, 0, 1, 2, 3, 4, 5], [[0, 0, 0, 2], [3, 3, 5, 7]])
testGetChanges('remove middle, end', [1, 2, 3], [1, 1.3, 1.6, 2, 3, 4, 5], [[1, 1, 1, 3], [3, 3, 5, 7]])
testGetChanges('remove start, middle, end', [1, 2, 3], [-1, 0, 1, 1.3, 1.6, 2, 3, 4, 5],
  [[0, 0, 0, 2], [1, 1, 3, 5], [3, 3, 7, 9]])
testGetChanges('remove start, prepend', [-0.5, 1, 2, 3], [-1, 0, 1, 2, 3], [[0, 1, 0, 2]])
testGetChanges('remove start, insert', [1, 2, 2.5, 3], [-1, 0, 1, 2, 3], [[0, 0, 0, 2], [2, 3, 4, 4]])
testGetChanges('remove start, append', [1, 2, 3, 4], [-1, 0, 1, 2, 3], [[0, 0, 0, 2], [3, 4, 5, 5]])
testGetChanges('remove middle, prepend', [0, 1, 2, 3], [1, 1.3, 1.6, 2, 3], [[0, 1, 0, 0], [2, 2, 1, 3]])
testGetChanges('remove middle, insert', [1, 2, 2.5, 3], [1, 1.3, 1.6, 2, 3], [[1, 1, 1, 3], [2, 3, 4, 4]])
testGetChanges('remove middle, insert, same', [1, 1.5, 2, 3], [1, 1.3, 1.6, 2, 3], [[1, 2, 1, 3]])
testGetChanges('remove middle, append', [1, 2, 3, 4], [1, 1.3, 1.6, 2, 3], [[1, 1, 1, 3], [3, 4, 5, 5]])
testGetChanges('remove end, prepend', [0, 1, 2, 3], [1, 2, 3, 4, 5], [[0, 1, 0, 0], [4, 4, 3, 5]])
testGetChanges('remove end, insert', [1, 2, 2.5, 3], [1, 2, 3, 4, 5], [[2, 3, 2, 2], [4, 4, 3, 5]])
testGetChanges('remove end, append', [1, 2, 3, 3.5], [1, 2, 3, 4, 5], [[3, 4, 3, 5]])
testGetChanges('change everywhere', [-1.5, 3, 4, -5.5, 7, 8, -9.5], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [[0, 1, 0, 2], [3, 4, 4, 6], [6, 7, 8, 10]])

testSyncChanges('both empty', [], [])
testSyncChanges('current empty', [1, 2, 3], [])
testSyncChanges('next empty', [], [1, 2, 3])
testSyncChanges('unchanged', [1, 2, 3], [1, 2, 3])
testSyncChanges('prepend', [-1, 0, 1, 2, 3], [1, 2, 3])
testSyncChanges('insert', [1, 2, 2.3, 2.6, 3], [1, 2, 3])
testSyncChanges('append', [1, 2, 3, 4, 5], [1, 2, 3])
testSyncChanges('prepend, insert', [-1, 0, 1, 2, 2.3, 2.6, 3], [1, 2, 3])
testSyncChanges('prepend, append', [-1, 0, 1, 2, 3, 4, 5], [1, 2, 3])
testSyncChanges('insert, append', [1, 2, 2.3, 2.6, 3, 4, 5], [1, 2, 3])
testSyncChanges('prepend, insert, append', [-1, 0, 1, 2, 2.3, 2.6, 3, 4, 5], [1, 2, 3])
testSyncChanges('remove start', [1, 2, 3], [-1, 0, 1, 2, 3])
testSyncChanges('remove middle', [1, 2, 3], [1, 1.3, 1.6, 2, 3])
testSyncChanges('remove end', [1, 2, 3], [1, 2, 3, 4, 5])
testSyncChanges('remove start, middle', [1, 2, 3], [-1, 0, 1, 1.3, 1.6, 2, 3])
testSyncChanges('remove start, end', [1, 2, 3], [-1, 0, 1, 2, 3, 4, 5])
testSyncChanges('remove middle, end', [1, 2, 3], [1, 1.3, 1.6, 2, 3, 4, 5])
testSyncChanges('remove start, middle, end', [1, 2, 3], [-1, 0, 1, 1.3, 1.6, 2, 3, 4, 5])
testSyncChanges('remove start, prepend', [-0.5, 1, 2, 3], [-1, 0, 1, 2, 3])
testSyncChanges('remove start, insert', [1, 2, 2.5, 3], [-1, 0, 1, 2, 3])
testSyncChanges('remove start, append', [1, 2, 3, 4], [-1, 0, 1, 2, 3])
testSyncChanges('remove middle, prepend', [0, 1, 2, 3], [1, 1.3, 1.6, 2, 3])
testSyncChanges('remove middle, insert', [1, 2, 2.5, 3], [1, 1.3, 1.6, 2, 3])
testSyncChanges('remove middle, insert, same', [1, 1.5, 2, 3], [1, 1.3, 1.6, 2, 3])
testSyncChanges('remove middle, append', [1, 2, 3, 4], [1, 1.3, 1.6, 2, 3])
testSyncChanges('remove end, prepend', [0, 1, 2, 3], [1, 2, 3, 4, 5])
testSyncChanges('remove end, insert', [1, 2, 2.5, 3], [1, 2, 3, 4, 5])
testSyncChanges('remove end, append', [1, 2, 3, 3.5], [1, 2, 3, 4, 5])
testSyncChanges('change everywhere', [-1.5, 3, 4, -5.5, 7, 8, -9.5], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0])

test(
  'for each unchanged',
  () => {
    const items = []
    forEachUnchanged(
      [-1, 0, 1, 3, 5, 6, 7],
      [1, 2, 3, 4, 5],
      getChanges(Object.is, [-1, 0, 1, 3, 5, 6, 7], [1, 2, 3, 4, 5]),
      (from, to) => items.push([from, to])
    )
    expect(items).toEqual([[1, 1], [3, 3], [5, 5]])
  }
)

test(
  'for each unchanged, with tail',
  () => {
    const items = []
    forEachUnchanged(
      [-1, 0, 1, 3, 5],
      [1, 2, 3, 4, 5],
      getChanges(Object.is, [-1, 0, 1, 3, 5], [1, 2, 3, 4, 5]),
      (from, to) => items.push([from, to])
    )
    expect(items).toEqual([[1, 1], [3, 3], [5, 5]])
  }
)

test(
  'apply diff',
  () => expect(
    sync(Object.is, insert, remove, [-1, 0, 1, 3, 5, 6, 7], [1, 2, 3, 4, 5])
  ).toEqual([-1, 0, 1, 3, 5, 6, 7])
)
