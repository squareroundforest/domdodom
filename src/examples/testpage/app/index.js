/* global document setTimeout console */

import {htmlContent, render, tag} from "../../.."

const app = tag.div(
	{id: "root"},
	htmlContent("<div id='ref'><ul><li>foo</li><li>bar</li><li>baz</li></ul></div>")
)

export const page = tag.html(
	{lang: "en-US"},
	tag.head(tag.meta({charset: "utf-8"}), tag.title("test mount")),
	tag.body(app, tag.script({src: "/client/index.js"}))
)

if (typeof window !== "undefined") {
	const initial = tag.div({id: "ref"}, tag.div("foo"), tag.div("bar"), tag.div("baz"), tag.div("qux"))

	const update = tag.div({id: "ref"}, tag.div("foo"), tag.code("bar"), tag.div("baz"), tag.div("qux"))

	render(initial, document.getElementById("ref"))
	setTimeout(function() {
		console.log("updating")
		render(update, document.getElementById("ref"))
	}, 999)
}
