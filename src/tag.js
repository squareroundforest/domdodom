import {define, defineWithOptions} from "./define"

const tags = "html, head, title, meta, script, body, div, ol, ul, li, span, h1, p, code"
const voidTags = "br"

export const tag = {}

for (const name of tags.split(/ *, */)) {
	tag[name] = define(name)
}

for (const name of voidTags.split(/ *, */)) {
	tag[name] = defineWithOptions(name, {isVoid: true})
}

// TODO: generate exported tags offline (https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
