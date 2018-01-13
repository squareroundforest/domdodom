import {define} from './define'

const tags = 'html, head, meta, script, body, div, ul, li, span, h1, p'
const voidTags = 'br'

export const tag = {}

for (let name of tags.split(/ *, */)) {
  tag[name] = define(name)
}

for (let name of voidTags.split(/ *, */)) {
  tag[name] = define(name, {isVoid: true})
}
