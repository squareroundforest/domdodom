/* global beforeEach test expect */

import {root, initDOM, captureDOM, capturedEq} from './domtest'
import {render, htmlContent, tag} from '.'

beforeEach(() => initDOM(tag.div))

test('no diff', () => {
  const test = tag.div(
    {id: 'test'},
    tag.h1({className: 'title'}, 'A list:'),
    tag.ul(
      tag.li('foo'),
      tag.li('bar'),
      tag.li('baz')
    )
  )

  initDOM(tag.div(test))
  const before = captureDOM(document.getElementById('test'))
  render(test, document.getElementById('test'))
  const after = captureDOM(document.getElementById('test'))
  expect(capturedEq(before, after)).toBe(true)
})

test('no diff, html', () => {
  const html = htmlContent("<ul id='list'><li>foo</li><li>bar</li><li>baz</li></ul>")
  initDOM(tag.div(html))
  const before = captureDOM(document.getElementById('list'))
  render(html, document.getElementById('list'))
  const after = captureDOM(document.getElementById('list'))
  expect(capturedEq(before, after))
})

test('only required diff', () => {
  const initial = tag.div(
    {id: 'test'},
    tag.h1({className: 'title'}, 'A list:'),
    tag.ul(
      tag.li('foo'),
      tag.li('bar'),
      tag.li('baz')
    )
  )

  const update = tag.div(
    {id: 'test'},
    tag.h1({className: 'title'}, 'A list:'),
    tag.ul(
      tag.li('foo'),
      tag.li('qux'),
      tag.li('baz')
    )
  )

  initDOM(tag.div(initial))
  const before = captureDOM(document.getElementById('test'))
  render(update, document.getElementById('test'))
  const after = captureDOM(document.getElementById('test'))
  expect(capturedEq(before, after)).toBe(false)
  before.children[1].children.splice(1, 1)
  after.children[1].children.splice(1, 1)
  expect(capturedEq(before, after)).toBe(true)
})

test('change element type', () => {
  const initial = tag.div(
    {id: 'test'},
    tag.div('foo'),
    tag.div('bar'),
    tag.div('baz')
  )

  const update = tag.div(
    {id: 'test'},
    tag.div('foo'),
    tag.code('bar'),
    tag.div('baz')
  )

  initDOM(tag.div(initial))
  const before = captureDOM(document.getElementById('test'))
  render(update, document.getElementById('test'))
  const after = captureDOM(document.getElementById('test'))
  expect(capturedEq(before, after)).toBe(false)
  expect(after.children[2].children[0].text).toBe(before.children[2].children[0].text)
  before.children.splice(1, 2)
  after.children.splice(1, 2)
  expect(capturedEq(before, after)).toBe(true)
})

test('html, change node type', () => {
  const initial = htmlContent(`<div id="test"><div>foo</div><div>bar</div><div>baz</div></div>`)
  const update = htmlContent(`<div id="test"><div>foo</div>bar<div>baz</div></div>`)
  initDOM(tag.div(initial))
  const before = captureDOM(document.getElementById('test'))
  render(update, document.getElementById('test'))
  const after = captureDOM(document.getElementById('test'))
  expect(capturedEq(before, after)).toBe(false)
  expect(after.children[1].text).toBe(before.children[1].children[0].text)
  expect(after.children[2].children[0].text).toBe(before.children[2].children[0].text)
  before.children.splice(1, 2)
  after.children.splice(1, 2)
  expect(capturedEq(before, after)).toBe(true)
})

test('only required diff, html', () => {
  const initial = htmlContent(`<ul id="test"><li>foo</li><li>bar</li><li>baz</li></ul>`)
  const update = htmlContent(`<ul id="test"><li>foo</li><li>qux</li><li>baz</li></ul>`)
  initDOM(tag.div(initial))
  const before = captureDOM(document.getElementById('test'))
  render(update, document.getElementById('test'))
  const after = captureDOM(document.getElementById('test'))
  expect(capturedEq(before, after)).toBe(false)
  before.children.splice(1, 1)
  after.children.splice(1, 1)
  expect(capturedEq(before, after)).toBe(true)
})

test('html, only attribute change', () => {
  const initial = htmlContent(`<ul id="test"><li>foo</li><li>bar</li><li>baz</li></ul>`)
  const update = htmlContent(`<ul id="test"><li>foo</li><li style="display: none">bar</li><li>baz</li></ul>`)
  initDOM(tag.div(initial))
  const before = captureDOM(document.getElementById('test'))
  render(update, document.getElementById('test'))
  const after = captureDOM(document.getElementById('test'))
  expect(capturedEq(before, after)).toBe(false)
  after.children[1].attributes.length = 0
  expect(capturedEq(before, after)).toBe(true)
})

test('top level html multiple nodes', () => {
  const initial = htmlContent(`<div id="ref">foo</div><div>bar</div><div>baz</div>`)
  const update = htmlContent(`<div>qux</div><div>quux</div>`)
  initDOM(tag.div(initial))
  const before = captureDOM(root)
  render(update, document.getElementById('ref'))
  const after = captureDOM(root)
  expect(capturedEq(before, after)).toBe(false)
  before.children.splice(0, 1)
  after.children.splice(0, 2)
  expect(capturedEq(before, after)).toBe(true)
})
