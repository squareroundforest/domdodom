import {isElement, elementType, inspect, DefinitionError} from './define'
import hash from './hash'

const resolveTag = spec => {
  const children = spec.children.map(resolve)
  return {
    type: resolvedType.tag,
    name: spec.def.name,
    hash: hash(spec.def.name, ...children.map(c => c.hash)),
    props: spec.props,
    children: children
  }
}

const resolveComponent = spec => resolve(spec.component(spec.props, spec.children))

const resolveText = text => {
  return {
    type: resolvedType.text,
    text: String(text).trim(),
    hash: hash('#text'),
    props: {},
    children: []
  }
}

const resolveHTML = spec => {
  return {
    type: resolvedType.html,
    html: spec.children[0],
    hash: hash('#html'),
    props: {},
    children: []
  }
}

export const resolvedType = {
  tag: 0,
  text: 1,
  html: 2
}

export const resolve = node => {
  if (!isElement(node)) {
    return resolveText(node)
  }

  const spec = inspect(node)
  switch (spec.def.elementType) {
    case elementType.tag:
      return resolveTag(spec)
    case elementType.component:
      return resolveComponent(spec)
    case elementType.html:
      return resolveHTML(spec)
    default:
      throw new DefinitionError('unsupported element type')
  }
}
