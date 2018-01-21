/* global test expect beforeEach */
import {define, tag, render, htmlContent} from '.'
import {root, checkDOM, initDOM} from './domtest'

beforeEach(() => initDOM(tag.div))

test('element', () => {
  const p = tag.p({'class': 'pretty'}, 'foo')
  render(p, root)
  checkDOM(p)
})

test('component', () => {
  const foo = define(() => 'foo')
  render(foo, root)
  checkDOM(foo)
})

test('text', () => {
  render('foo', root)
  checkDOM('foo')
})

test('text, escaped', () => {
  const t = '<p>foo</p>'
  render(t, root)
  checkDOM(t)
})

test('text, convert', () => {
  render(42, root)
  checkDOM(42)
})

test('update attributes', () => {
  initDOM(tag.p({'class': 'before'}, 'foo'))
  const p = tag.p({'class': 'after'}, 'foo')
  render(p, root)
  checkDOM(p)
})

test('update text', () => {
  initDOM(tag.p('foo'))
  const p = tag.p('bar')
  render(p, root)
  checkDOM(p)
})

test('html', () => {
  const html = htmlContent('<p>foo</p>')
  render(html, root)
  checkDOM(html)
})

test('html as child', () => {
  const div = tag.div(
    tag.p('foo'),
    htmlContent('<p>bar</p><p>baz</p>'),
    tag.p('qux')
  )

  render(div, root)
  checkDOM(div)
})

test('html as child, to existing', () => {
  const div = tag.div(
    tag.p('foo'),
    htmlContent('<p>bar</p><p>baz</p>'),
    tag.p('qux')
  )

  initDOM(div)
  render(div, root)
  checkDOM(div)
})

test('html content, change node type', () => {
  initDOM(tag.div(htmlContent('<div><p>foo</p><p>bar</p><p>baz</p></div>')))
  const div = tag.div(htmlContent('<div><p>foo</p>bar<p>baz</p></div>'))
  render(div, root)
  checkDOM(div)
})

test('html content, changing attributes', () => {
  initDOM(tag.div(htmlContent('<div><p>foo</p><p class="pretty" style="red">bar</p><p>baz</p></div>')))
  const div = tag.div(htmlContent('<div><p>foo</p><p style="background: pink">bar</p><p>baz</p></div>'))
  render(div, root)
  checkDOM(div)
})

test('unsupported element', () => {
  expect(() => render(() => { return {def: {type: -1}} }, root)).toThrow(/unsupported/)
})
