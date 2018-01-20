/* global Node */
import {nodeType, DefinitionError} from './define'
import {filterSupportedDOMNodes, syncDOMNode, syncDOMNodes} from './dom'
import {applyDiff} from './diff'
import {resolve} from './resolve'

const tempNode = document.createElement('div')

const contentHTMLNodes = html => {
  tempNode.innerHTML = html
  const nodes = filterSupportedDOMNodes([...tempNode.childNodes])
  tempNode.innerHTML = ''
  return nodes
}

const applyAttributes = (props, domElement) => {
  [...domElement.attributes].forEach(a => {
    if (!(a.name in props)) {
      domElement.removeAttribute(a.name)
    }
  })

  Object.keys(props).forEach(name => domElement.setAttribute(name, props[name]))
}

const resolveContentHTML = nodes => nodes.reduce(
  (nodes, current) => nodes.concat(
    current.type === nodeType.html
      ? contentHTMLNodes(current.html)
      : current
  ),
  []
)

const mountEq = (domNode, node) => {
  if (node instanceof Node) {
    return node.nodeType === domNode.nodeType &&
      (node.nodeType !== Node.ELEMENT_NODE ||
      node.tagName === domNode.tagName)
  }

  if (node.type === nodeType.tag) {
    return domNode.nodeType === Node.ELEMENT_NODE && node.name === domNode.tagName
  }

  if (node.type === nodeType.text) {
    return true
  }

  throw new DefinitionError('unsupported node type')
}

const syncNode = (node, domNode) => {
  if (node instanceof Node) {
    syncDOMNode(node, domNode)
    return
  }

  mountNode(node, domNode)
}

const getDOMNode = node => {
  if (node instanceof Node) {
    return node
  }

  switch (node.type) {
    case nodeType.tag:
      return document.createElement(node.name)
    case nodeType.text:
      return document.createTextNode()
    default:
      throw new DefinitionError('unsupported node type')
  }
}

const mountChildren = (node, children) => {
  const remove = (list, from, to) => {
    list.slice(from, to).forEach(n => {
      if (n.parent === node) {
        node.removeChild(n)
      }
    })
    list.splice(from, to - from)
  }

  const insert = (list, at, nodes) => {
    const atNode = list.length > at ? list[at] : null
    nodes.forEach(n => node.insertBefore(getDOMNode(n), atNode))
    list.splice(at, 0, ...nodes)
  }

  children = resolveContentHTML(children)
  const domChildren = filterSupportedDOMNodes([...node.children])
  applyDiff(mountEq, remove, insert, domChildren, children)
  children.forEach((c, i) => syncNode(c, domChildren[i]))
}

const mountTag = (spec, domNode) => {
  const nextDomNode = domNode.nodeType !== Node.ELEMENT_NODE || domNode.tagName !== spec.name
    ? document.createElement(spec.name)
    : domNode

  applyAttributes(spec.props, nextDomNode)
  mountChildren(nextDomNode, spec.children)

  if (nextDomNode !== domNode) {
    domNode.parent.replaceChild(nextDomNode, domNode)
  }

  return nextDomNode
}

const mountText = (node, domNode) => {
  if (domNode.nodeName !== Node.TEXT_NODE) {
    const replace = document.createTextNode(node.text)
    domNode.parentNode.replaceChild(replace, domNode)
    return replace
  }

  if (node.text === domNode.textContent) {
    return domNode
  }

  domNode.textContent = node.text
  return domNode
}

const mountHTML = (node, domNode) => {
  return syncDOMNodes(domNode.parent, [domNode], contentHTMLNodes(node.html))
}

const mountNode = (node, domNode) => {
  switch (node.type) {
    case nodeType.tag:
      return mountTag(node, domNode)
    case nodeType.text:
      return mountText(node, domNode)
    case nodeType.html:
      return mountHTML(node, domNode)
    default:
      throw new DefinitionError('unsupported node type')
  }
}

export const mount = (node, domNode) => {
  return mountNode(resolve(node), domNode)
}
