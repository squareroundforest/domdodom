/* global test expect */
import {define, htmlContent} from './define'
import {markup, markupDoc} from './markup'
import tag from './tag'

test('markup, element', () => expect(
  markup(tag.p({className: 'greeting'}, 'Hello, world!'))
).toBe('<p class="greeting">Hello, world!</p>'))
test('markup, void element', () => expect(markup(tag.br)).toBe('<br>'))
test('markup, component', () => expect(markup(define(() => tag.p('Hello, world!')))).toBe('<p>Hello, world!</p>'))
test('markup, text', () => expect(markup('Hello, world!')).toBe('Hello, world!'))
test('markup, text, escaped', () => expect(markup('<p>Hello, world!</p>')).toBe('&lt;p&gt;Hello, world!&lt;/p&gt;'))
test('markup, text, convert', () => expect(markup(42)).toBe('42'))
test('markup, html', () => expect(markup(htmlContent('<p>Hello, world!</p>'))).toBe('<p>Hello, world!</p>'))
test('markup, unsupported', () => expect(() => markup(() => { return {def: {type: -1}} })).toThrow(/unsupported/))
test('markup, doc', () => expect(markupDoc(tag.html)).toBe('<!doctype html><html></html>'))
