/* global test expect */
import {define, tag, htmlContent} from '.'

test('extend sealed', () => expect(() => htmlContent('foo')({style: 'background: red'})).toThrow(/sealed/))
test('children for void', () => expect(() => tag.br('foo')).toThrow(/void/))
test('invalid definition', () => expect(() => define(42)).toThrow(/invalid/))
test('html content with element', () => expect(() => htmlContent(tag.p('foo'))).toThrow(/element/))
