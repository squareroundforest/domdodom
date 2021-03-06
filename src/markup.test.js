/* global test expect */

import {define, htmlContent, markup, markupDoc, tag} from "."

test("void element", () => expect(markup(tag.br)).toBe("<br>"))
test("text", () => expect(markup("foo")).toBe("foo"))
test("text, convert", () => expect(markup(42)).toBe("42"))

test("element", () =>
  expect(markup(tag.p({className: "pretty"}, "foo"))).toBe(
    '<p class="pretty">foo</p>'
  ))

test("component", () =>
  expect(markup(define(() => tag.p("foo")))).toBe("<p>foo</p>"))

test("text, escape", () =>
  expect(markup("<p>foo</p>")).toBe("&lt;p&gt;foo&lt;/p&gt;"))

test("html", () =>
  expect(markup(htmlContent("<p>foo</p>"))).toBe("<p>foo</p>"))

test("unsupported", () =>
  expect(() => markup(() => ({def: {type: -1}}))).toThrow(
    /unsupported/
  ))

test("doc", () =>
  expect(markupDoc(tag.html)).toBe("<!doctype html><html></html>"))
