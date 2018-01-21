/* global Node document */
import {nodeType} from './define'
import {filterSupportedDOMNodes, syncDOMNode, syncDOMNodes} from './dom'
import {applyDiff} from './diff'
import {resolve} from './resolve'

// TODO: move to dom
const tempNode = typeof document !== 'undefined' ? document.createElement('div') : undefined

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
    return (
      node.nodeType === domNode.nodeType && (
        node.nodeType !== Node.ELEMENT_NODE ||
        node.name === domNode.tagName
      )
    )
  }

  if (node.type === nodeType.tag) {
    return (
      domNode.nodeType === Node.ELEMENT_NODE &&
      node.name === domNode.tagName
    )
  }

  return true
}

const syncNode = (node, domNode) => {
  if (node instanceof Node) {
    syncDOMNode(domNode, node)
    return
  }

  mountNode(node, domNode)
}

const getDOMNode = node => {
  if (node instanceof Node) {
    return node
  }

  if (node.type === nodeType.tag) {
    return document.createElement(node.name)
  }

  return document.createTextNode(node.text)
}

const mountChildren = (node, children) => {
  const remove = (list, from, to) => {
    list.slice(from, to).forEach(n => node.removeChild(n))
    list.splice(from, to - from)
    return list
  }

  const insert = (list, at, nodes) => {
    const atNode = list.length > at ? list[at] : null
    const domNodes = nodes.map(getDOMNode)
    domNodes.forEach(n => node.insertBefore(n, atNode))
    list.splice(at, 0, ...domNodes)
    return list
  }

  children = resolveContentHTML(children)
  const domChildren = filterSupportedDOMNodes([...node.childNodes])
  applyDiff(mountEq, remove, insert, domChildren, children)
  children.forEach((c, i) => syncNode(c, domChildren[i]))
}

const mountTag = (spec, domNode) => {
  // create a function for this check in dom
  const nextDomNode =
    domNode.nodeType !== Node.ELEMENT_NODE ||
    domNode.tagName !== spec.name
    ? document.createElement(spec.name)
    : domNode

  applyAttributes(spec.props, nextDomNode)
  mountChildren(nextDomNode, spec.children)

  if (nextDomNode !== domNode) {
    domNode.parentNode.replaceChild(nextDomNode, domNode)
  }

  return nextDomNode
}

const mountText = (node, domNode) => {
  if (domNode.nodeType !== Node.TEXT_NODE) {
    const replace = document.createTextNode(node.text)
    domNode.parentNode.replaceChild(replace, domNode)
    return replace
  }

  if (domNode.textContent !== node.text) {
    domNode.textContent = node.text
  }

  return domNode
}

const mountHTML = (node, domNode) => {
  return syncDOMNodes(
    domNode.parentNode,
    [domNode],
    contentHTMLNodes(node.html),
    domNode.nextSibling
  )
}

const mountNode = (node, domNode) => {
  switch (node.type) {
    case nodeType.tag:
      return mountTag(node, domNode)
    case nodeType.text:
      return mountText(node, domNode)
    case nodeType.html:
      return mountHTML(node, domNode)
  }
}

export const mount = (node, domNode) => mountNode(resolve(node), domNode)
