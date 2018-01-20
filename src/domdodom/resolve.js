import {isElement, nodeType, inspect, DefinitionError} from './define'
import hash from './hash'

const resolveTag = spec => {
  const children = resolve(...spec.children)
  return {
    type: nodeType.tag,
    name: spec.def.name,
    hash: hash(spec.def.name, ...children.map(c => c.hash)),
    props: spec.props,
    children: children
  }
}

const resolveComponent = spec => resolve(spec.component(spec.props, spec.children))

const resolveText = text => {
  return {
    type: nodeType.text,
    text: String(text).trim(),
    hash: hash('#text'),
    props: {},
    children: []
  }
}

const resolveHTML = spec => {
  return {
    type: nodeType.html,
    html: spec.children[0],
    hash: hash('#html'),
    props: {},
    children: []
  }
}

export const resolve = node => {
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
      throw new DefinitionError('unsupported element type')
  }
}
