/* global test expect beforeEach */

import {checkDOM, initDOM, root} from "./domtest"
import {define, htmlContent, render, tag} from "."

beforeEach(() => initDOM(tag.div))

test("element", function() {
	const p = tag.p({class: "pretty"}, "foo")
	render(p, root)
	checkDOM(p)
})

test("component", function() {
	const foo = define(() => "foo")
	render(foo, root)
	checkDOM(foo)
})

test("text", function() {
	render("foo", root)
	checkDOM("foo")
})

test("text, escaped", function() {
	const t = "<p>foo</p>"
	render(t, root)
	checkDOM(t)
})

test("text, convert", function() {
	render(42, root)
	checkDOM(42)
})

test("update attributes", function() {
	initDOM(tag.p({class: "before"}, "foo"))
	const p = tag.p({class: "after"}, "foo")
	render(p, root)
	checkDOM(p)
})

test("update text", function() {
	initDOM(tag.p("foo"))
	const p = tag.p("bar")
	render(p, root)
	checkDOM(p)
})

test("html", function() {
	const html = htmlContent("<p>foo</p>")
	render(html, root)
	checkDOM(html)
})

test("html as child", function() {
	const div = tag.div(
		tag.p("foo"),
		htmlContent("<p>bar</p><p>baz</p>"),
		tag.p("qux")
	)

	render(div, root)
	checkDOM(div)
})

test("html as child, to existing", function() {
	const div = tag.div(
		tag.p("foo"),
		htmlContent("<p>bar</p><p>baz</p>"),
		tag.p("qux")
	)

	initDOM(div)
	render(div, root)
	checkDOM(div)
})

test("html content, change node type", function() {
	initDOM(
		tag.div(
			htmlContent(
				"<div><p>foo</p><p>bar</p><p>baz</p></div>"
			)
		)
	)
	const div = tag.div(
		htmlContent("<div><p>foo</p>bar<p>baz</p></div>")
	)
	render(div, root)
	checkDOM(div)
})

test("html content, changing attributes", function() {
	initDOM(
		tag.div(
			htmlContent(
				'<div><p>foo</p><p class="pretty" style="red">bar</p><p>baz</p></div>'
			)
		)
	)
	const div = tag.div(
		htmlContent(
			'<div><p>foo</p><p style="background: pink">bar</p><p>baz</p></div>'
		)
	)
	render(div, root)
	checkDOM(div)
})

test("unsupported element", function() {
	expect(() => render(() => ({def: {type: -1}}), root)).toThrow(
		/unsupported/
	)
})
