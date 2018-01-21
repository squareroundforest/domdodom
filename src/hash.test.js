/* global describe test expect */
import {series} from './hash'

describe('hash', () => {
  test('initial seed', () => expect(series(0)('foo')).toBe(84696351))
  test('large seed', () => expect(series(0x10203)(('foo'))).toBe(1456420779))
  test('same', () => {
    const hash = series(0)
    const h1 = hash('foo')
    const h2 = hash('foo')
    expect(h2).toBe(h1)
  })
})

describe('hash sum', () => {
  test('two', () => {
    const hash = series(0)
    const h1 = hash('foo')
    const h2 = hash('bar', h1)
    expect(h2).toBe(1071288597)
  })
  test('many', () => {
    const count = 10000
    const hash = series(0)
    const hashes = []
    for (let i = 0; i < count; i++) {
      hashes.push(hash('test' + String(i)))
    }

    const h = hash('foo', ...hashes)
    expect(h).toBe(1356017541)
  })
})
