import {inspect, nodeType} from './define'
import {attributeName, escapeAttribute} from './html'

const mountElement = (el, name) => {
  if (el.tagName === name) {
    return el
  }

  const nel = document.createElement(name)
  el.parentNode.replaceChild(nel, el)
  return nel
}

const mountChildren = (els, specs) => {
  // equality
  // diff
}

const mountTag = (el, spec) => {
  el = mountElement(el, spec.name)
  Object.key(spec.props).forEach(prop => el.setAttribute(
    attributeName(prop),
    escapeAttribute(spec.props[prop])
  ))

  mountChildren(el.children, spec.children)
}

const mountComponent = (el, spec) => {}

export const mount = (el, node) => {
  const spec = inspect(node)
  const mount = spec.def.type === nodeType.component
    ? mountComponent
    : mountTag
  return mount(el, spec)
}
