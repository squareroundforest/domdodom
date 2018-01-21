import {define, defineWithOptions} from './define'

const tags = 'html, head, title, meta, script, body, div, ul, li, span, h1, p'
const voidTags = 'br'

export const tag = {}

for (let name of tags.split(/ *, */)) {
  tag[name] = define(name)
}

for (let name of voidTags.split(/ *, */)) {
  tag[name] = defineWithOptions(name, {isVoid: true})
}
