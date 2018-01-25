import {DefinitionError, inspect, isElement, nodeType} from "./define"
import hash from "./hash"

function resolveTag(spec) {
  const children = spec.children.map(resolve)
  return {
    type: nodeType.tag,
    name: spec.def.name.toUpperCase(),
    hash: hash(spec.def.name, ...children.map(c => c.hash)),
    props: spec.props,
    children,
  }
}

const resolveComponent = spec =>
  resolve(spec.def.component(spec.props, spec.children))

const resolveText = text => ({
  type: nodeType.text,
  text: String(text).trim(),
  hash: hash("#text"),
})

const resolveHTML = spec => ({
  type: nodeType.html,
  html: spec.children[0],
  hash: hash("#html"),
})

export function resolve(node) {
  if (!isElement(node)) {
    return resolveText(node)
  }

  const spec = inspect(node)
  switch (spec.def.type) {
    case nodeType.tag:
      return resolveTag(spec)
    case nodeType.component:
      return resolveComponent(spec)
    case nodeType.html:
      return resolveHTML(spec)
    default:
      throw new DefinitionError("unsupported element type")
  }
}
