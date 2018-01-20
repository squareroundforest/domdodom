/* global test expect */
import {changeSet, applyChangeSet} from './diff'

const remove = (a, from, to) => {
  a.splice(from, to - from)
  return a
}

const insert = (a, at, items) => {
  a.splice(at, 0, ...items)
  return a
}

const testChangeSet = (title, current, next, expected) => test('change set: ' + title, () => {
  const c = expected.map(e => {
    return {deleteFrom: e[0], deleteTo: e[1], insertFrom: e[2], insertTo: e[3]}
  })
  expect(changeSet(Object.is, current, next)).toEqual(c)
})

const testApply = (title, current, next) => test('apply: ' + title, () => {
  const c = changeSet(Object.is, current, next)
  expect(applyChangeSet(remove, insert, current, next, c)).toEqual(next)
})

testChangeSet('both empty', [], [], [])
testChangeSet('current empty', [], [1, 2, 3], [[0, 0, 0, 3]])
testChangeSet('next empty', [1, 2, 3], [], [[0, 3, 0, 0]])
testChangeSet('unchanged', [1, 2, 3], [1, 2, 3], [])
testChangeSet('prepend', [1, 2, 3], [-1, 0, 1, 2, 3], [[0, 0, 0, 2]])
testChangeSet('insert', [1, 2, 3], [1, 2, 2.3, 2.6, 3], [[2, 2, 2, 4]])
testChangeSet('append', [1, 2, 3], [1, 2, 3, 4, 5], [[3, 3, 3, 5]])
testChangeSet('prepend, insert', [1, 2, 3], [-1, 0, 1, 2, 2.3, 2.6, 3], [[0, 0, 0, 2], [2, 2, 4, 6]])
testChangeSet('prepend, append', [1, 2, 3], [-1, 0, 1, 2, 3, 4, 5], [[0, 0, 0, 2], [3, 3, 5, 7]])
testChangeSet('insert, append', [1, 2, 3], [1, 2, 2.3, 2.6, 3, 4, 5], [[2, 2, 2, 4], [3, 3, 5, 7]])
testChangeSet('prepend, insert, append', [1, 2, 3], [-1, 0, 1, 2, 2.3, 2.6, 3, 4, 5],
    [[0, 0, 0, 2], [2, 2, 4, 6], [3, 3, 7, 9]])
testChangeSet('remove start', [-1, 0, 1, 2, 3], [1, 2, 3], [[0, 2, 0, 0]])
testChangeSet('remove middle', [1, 1.3, 1.6, 2, 3], [1, 2, 3], [[1, 3, 1, 1]])
testChangeSet('remove end', [1, 2, 3, 4, 5], [1, 2, 3], [[3, 5, 3, 3]])
testChangeSet('remove start, middle', [-1, 0, 1, 1.3, 1.6, 2, 3], [1, 2, 3], [[0, 2, 0, 0], [3, 5, 1, 1]])
testChangeSet('remove start, end', [-1, 0, 1, 2, 3, 4, 5], [1, 2, 3], [[0, 2, 0, 0], [5, 7, 3, 3]])
testChangeSet('remove middle, end', [1, 1.3, 1.6, 2, 3, 4, 5], [1, 2, 3], [[1, 3, 1, 1], [5, 7, 3, 3]])
testChangeSet('remove start, middle, end', [-1, 0, 1, 1.3, 1.6, 2, 3, 4, 5], [1, 2, 3],
    [[0, 2, 0, 0], [3, 5, 1, 1], [7, 9, 3, 3]])
testChangeSet('remove start, prepend', [-1, 0, 1, 2, 3], [-0.5, 1, 2, 3], [[0, 2, 0, 1]])
testChangeSet('remove start, insert', [-1, 0, 1, 2, 3], [1, 2, 2.5, 3], [[0, 2, 0, 0], [4, 4, 2, 3]])
testChangeSet('remove start, append', [-1, 0, 1, 2, 3], [1, 2, 3, 4], [[0, 2, 0, 0], [5, 5, 3, 4]])
testChangeSet('remove middle, prepend', [1, 1.3, 1.6, 2, 3], [0, 1, 2, 3], [[0, 0, 0, 1], [1, 3, 2, 2]])
testChangeSet('remove middle, insert', [1, 1.3, 1.6, 2, 3], [1, 2, 2.5, 3], [[1, 3, 1, 1], [4, 4, 2, 3]])
testChangeSet('remove middle, insert, same', [1, 1.3, 1.6, 2, 3], [1, 1.5, 2, 3], [[1, 3, 1, 2]])
testChangeSet('remove middle, append', [1, 1.3, 1.6, 2, 3], [1, 2, 3, 4], [[1, 3, 1, 1], [5, 5, 3, 4]])
testChangeSet('remove end, prepend', [1, 2, 3, 4, 5], [0, 1, 2, 3], [[0, 0, 0, 1], [3, 5, 4, 4]])
testChangeSet('remove end, insert', [1, 2, 3, 4, 5], [1, 2, 2.5, 3], [[2, 2, 2, 3], [3, 5, 4, 4]])
testChangeSet('remove end, append', [1, 2, 3, 4, 5], [1, 2, 3, 3.5], [[3, 5, 3, 4]])
testChangeSet('change everywhere', [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [-1.5, 3, 4, -5.5, 7, 8, -9.5],
    [[0, 2, 0, 1], [4, 6, 3, 4], [8, 10, 6, 7]])

testApply('both empty', [], [])
testApply('current empty', [], [1, 2, 3])
testApply('next empty', [1, 2, 3], [])
testApply('unchanged', [1, 2, 3], [1, 2, 3])
testApply('prepend', [1, 2, 3], [-1, 0, 1, 2, 3])
testApply('insert', [1, 2, 3], [1, 2, 2.3, 2.6, 3])
testApply('append', [1, 2, 3], [1, 2, 3, 4, 5])
testApply('prepend, insert', [1, 2, 3], [-1, 0, 1, 2, 2.3, 2.6, 3])
testApply('prepend, append', [1, 2, 3], [-1, 0, 1, 2, 3, 4, 5])
testApply('insert, append', [1, 2, 3], [1, 2, 2.3, 2.6, 3, 4, 5])
testApply('prepend, insert, append', [1, 2, 3], [-1, 0, 1, 2, 2.3, 2.6, 3, 4, 5])
testApply('remove start', [-1, 0, 1, 2, 3], [1, 2, 3])
testApply('remove middle', [1, 1.3, 1.6, 2, 3], [1, 2, 3])
testApply('remove end', [1, 2, 3, 4, 5], [1, 2, 3])
testApply('remove start, middle', [-1, 0, 1, 1.3, 1.6, 2, 3], [1, 2, 3])
testApply('remove start, end', [-1, 0, 1, 2, 3, 4, 5], [1, 2, 3])
testApply('remove middle, end', [1, 1.3, 1.6, 2, 3, 4, 5], [1, 2, 3])
testApply('remove start, middle, end', [-1, 0, 1, 1.3, 1.6, 2, 3, 4, 5], [1, 2, 3])
testApply('remove start, prepend', [-1, 0, 1, 2, 3], [-0.5, 1, 2, 3])
testApply('remove start, insert', [-1, 0, 1, 2, 3], [1, 2, 2.5, 3])
testApply('remove start, append', [-1, 0, 1, 2, 3], [1, 2, 3, 4])
testApply('remove middle, prepend', [1, 1.3, 1.6, 2, 3], [0, 1, 2, 3])
testApply('remove middle, insert', [1, 1.3, 1.6, 2, 3], [1, 2, 2.5, 3])
testApply('remove middle, insert, same', [1, 1.3, 1.6, 2, 3], [1, 1.5, 2, 3])
testApply('remove middle, append', [1, 1.3, 1.6, 2, 3], [1, 2, 3, 4])
testApply('remove end, prepend', [1, 2, 3, 4, 5], [0, 1, 2, 3])
testApply('remove end, insert', [1, 2, 3, 4, 5], [1, 2, 2.5, 3])
testApply('remove end, append', [1, 2, 3, 4, 5], [1, 2, 3, 3.5])
testApply('change everywhere', [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [-1.5, 3, 4, -5.5, 7, 8, -9.5])
