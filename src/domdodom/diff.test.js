/* global test expect */

import {changeSet, applyChangeSet} from './diff'

const testRemove = (a, from, to) => {
  a.splice(from, to - from)
  return a
}

const testInsert = (a, at, items) => {
  a.splice(at, 0, ...items)
  return a
}

const testChangeSet = (title, prev, next, expected) => test('change set: ' + title, () =>
  expect(changeSet(Object.is, prev, next)).toEqual(expected))

const testApply = (title, prev, next) => test('apply: ' + title, () => {
  const c = changeSet(Object.is, prev, next)
  expect(applyChangeSet(testRemove, testInsert, c, prev, next)).toEqual(next)
})

testChangeSet('empty lists', [], [], [])
testChangeSet('prev empty', [], [1, 2, 3], [
  {deleteFrom: 0, deleteTo: 0, insertFrom: 0, insertTo: 3}
])
testChangeSet('next empty', [1, 2, 3], [], [{
  deleteFrom: 0, deleteTo: 3, insertFrom: 0, insertTo: 0}
])
testChangeSet('unchanged', [1, 2, 3], [1, 2, 3], [])
testChangeSet('prepend', [1, 2, 3], [-1, 0, 1, 2, 3], [
  {deleteFrom: 0, deleteTo: 0, insertFrom: 0, insertTo: 2}
])
testChangeSet('insert', [1, 2, 3], [1, 2, 2.3, 2.6, 3], [
  {deleteFrom: 2, deleteTo: 2, insertFrom: 2, insertTo: 4}
])
testChangeSet('append', [1, 2, 3], [1, 2, 3, 4, 5], [
  {deleteFrom: 3, deleteTo: 3, insertFrom: 3, insertTo: 5}
])
testChangeSet('prepend, insert', [1, 2, 3], [-1, 0, 1, 2, 2.3, 2.6, 3], [
  {deleteFrom: 0, deleteTo: 0, insertFrom: 0, insertTo: 2},
  {deleteFrom: 2, deleteTo: 2, insertFrom: 4, insertTo: 6}
])
testChangeSet('prepend, append', [1, 2, 3], [-1, 0, 1, 2, 3, 4, 5], [
  {deleteFrom: 0, deleteTo: 0, insertFrom: 0, insertTo: 2},
  {deleteFrom: 3, deleteTo: 3, insertFrom: 5, insertTo: 7}
])
testChangeSet('insert, append', [1, 2, 3], [1, 2, 2.3, 2.6, 3, 4, 5], [
  {deleteFrom: 2, deleteTo: 2, insertFrom: 2, insertTo: 4},
  {deleteFrom: 3, deleteTo: 3, insertFrom: 5, insertTo: 7}
])
testChangeSet('prepend, insert, append', [1, 2, 3], [-1, 0, 1, 2, 2.3, 2.6, 3, 4, 5], [
  {deleteFrom: 0, deleteTo: 0, insertFrom: 0, insertTo: 2},
  {deleteFrom: 2, deleteTo: 2, insertFrom: 4, insertTo: 6},
  {deleteFrom: 3, deleteTo: 3, insertFrom: 7, insertTo: 9}
])
testChangeSet('remove start', [-1, 0, 1, 2, 3], [1, 2, 3], [
  {deleteFrom: 0, deleteTo: 2, insertFrom: 0, insertTo: 0}
])
testChangeSet('remove middle', [1, 1.3, 1.6, 2, 3], [1, 2, 3], [
  {deleteFrom: 1, deleteTo: 3, insertFrom: 1, insertTo: 1}
])
testChangeSet('remove end', [1, 2, 3, 4, 5], [1, 2, 3], [
  {deleteFrom: 3, deleteTo: 5, insertFrom: 3, insertTo: 3}
])
testChangeSet('remove start, middle', [-1, 0, 1, 1.3, 1.6, 2, 3], [1, 2, 3], [
  {deleteFrom: 0, deleteTo: 2, insertFrom: 0, insertTo: 0},
  {deleteFrom: 3, deleteTo: 5, insertFrom: 1, insertTo: 1}
])
testChangeSet('remove start, end', [-1, 0, 1, 2, 3, 4, 5], [1, 2, 3], [
  {deleteFrom: 0, deleteTo: 2, insertFrom: 0, insertTo: 0},
  {deleteFrom: 5, deleteTo: 7, insertFrom: 3, insertTo: 3}
])
testChangeSet('remove middle, end', [1, 1.3, 1.6, 2, 3, 4, 5], [1, 2, 3], [
  {deleteFrom: 1, deleteTo: 3, insertFrom: 1, insertTo: 1},
  {deleteFrom: 5, deleteTo: 7, insertFrom: 3, insertTo: 3}
])
testChangeSet('remove start, middle, end', [-1, 0, 1, 1.3, 1.6, 2, 3, 4, 5], [1, 2, 3], [
  {deleteFrom: 0, deleteTo: 2, insertFrom: 0, insertTo: 0},
  {deleteFrom: 3, deleteTo: 5, insertFrom: 1, insertTo: 1},
  {deleteFrom: 7, deleteTo: 9, insertFrom: 3, insertTo: 3}
])
testChangeSet('remove start, prepend', [-1, 0, 1, 2, 3], [-0.5, 1, 2, 3], [
  {deleteFrom: 0, deleteTo: 2, insertFrom: 0, insertTo: 1}
])
testChangeSet('remove start, insert', [-1, 0, 1, 2, 3], [1, 2, 2.5, 3], [
  {deleteFrom: 0, deleteTo: 2, insertFrom: 0, insertTo: 0},
  {deleteFrom: 4, deleteTo: 4, insertFrom: 2, insertTo: 3}
])
testChangeSet('remove start, append', [-1, 0, 1, 2, 3], [1, 2, 3, 4], [
  {deleteFrom: 0, deleteTo: 2, insertFrom: 0, insertTo: 0},
  {deleteFrom: 5, deleteTo: 5, insertFrom: 3, insertTo: 4}
])
testChangeSet('remove middle, prepend', [1, 1.3, 1.6, 2, 3], [0, 1, 2, 3], [
  {deleteFrom: 0, deleteTo: 0, insertFrom: 0, insertTo: 1},
  {deleteFrom: 1, deleteTo: 3, insertFrom: 2, insertTo: 2}
])
testChangeSet('remove middle, insert', [1, 1.3, 1.6, 2, 3], [1, 2, 2.5, 3], [
  {deleteFrom: 1, deleteTo: 3, insertFrom: 1, insertTo: 1},
  {deleteFrom: 4, deleteTo: 4, insertFrom: 2, insertTo: 3}
])
testChangeSet('remove middle, insert, same', [1, 1.3, 1.6, 2, 3], [1, 1.5, 2, 3], [
  {deleteFrom: 1, deleteTo: 3, insertFrom: 1, insertTo: 2}
])
testChangeSet('remove middle, append', [1, 1.3, 1.6, 2, 3], [1, 2, 3, 4], [
  {deleteFrom: 1, deleteTo: 3, insertFrom: 1, insertTo: 1},
  {deleteFrom: 5, deleteTo: 5, insertFrom: 3, insertTo: 4}
])
testChangeSet('remove end, prepend', [1, 2, 3, 4, 5], [0, 1, 2, 3], [
  {deleteFrom: 0, deleteTo: 0, insertFrom: 0, insertTo: 1},
  {deleteFrom: 3, deleteTo: 5, insertFrom: 4, insertTo: 4}
])
testChangeSet('remove end, insert', [1, 2, 3, 4, 5], [1, 2, 2.5, 3], [
  {deleteFrom: 2, deleteTo: 2, insertFrom: 2, insertTo: 3},
  {deleteFrom: 3, deleteTo: 5, insertFrom: 4, insertTo: 4}
])
testChangeSet('remove end, append', [1, 2, 3, 4, 5], [1, 2, 3, 3.5], [
  {deleteFrom: 3, deleteTo: 5, insertFrom: 3, insertTo: 4}
])
testChangeSet('change everywhere', [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [-1.5, 3, 4, -5.5, 7, 8, -9.5], [
  {deleteFrom: 0, deleteTo: 2, insertFrom: 0, insertTo: 1},
  {deleteFrom: 4, deleteTo: 6, insertFrom: 3, insertTo: 4},
  {deleteFrom: 8, deleteTo: 10, insertFrom: 6, insertTo: 7}
])

testApply('empty lists', [], [])
testApply('prev empty', [], [1, 2, 3])
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
