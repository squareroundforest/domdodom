import {isElement, inspect, elementType, DefinitionError} from './define'

const mountDOMElement = (name, existing) => {
  if (existing && existing.tagName === name.toUpperCase()) {
    return existing
  }

  const newElement = document.createElement(name)
  if (existing) {
    existing.parentNode.replaceChild(newElement, existing)
  }

  return newElement
}

const applyAttributes = (props, domElement) => {
  Array.from(domElement.attributes).forEach(a => {
    if (!(a.name in props)) {
      domElement.removeAttribute(a.name)
    }
  })

  Object.keys(props).forEach(name => domElement.setAttribute(name, props[name]))
}

const mountChildren = (nodes, domNodes) => {
  // equality
  // diff
}

const mountTag = (spec, domNode) => {
  const domElement = mountDOMElement(spec.name, domNode)
  applyAttributes(spec.props, domElement)
  mountChildren(spec.children, domElement.childNodes)
  return domElement
}

const mountComponent = (el, spec) => {}

const mountText = () => {}

const mountHTML = () => {}

export const mount = (node, domNode) => {
  if (!isElement(node)) {
    return mountText(node, domNode)
  }

  const spec = inspect(node)
  switch (spec.def.type) {
    case elementType.tag:
      return mountTag(spec, domNode)
    case elementType.component:
      return mountComponent(spec, domNode)
    case elementType.html:
      return mountHTML(spec, domNode)
    default:
      throw new DefinitionError('unsupported element type')
  }
}
