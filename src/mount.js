/* global Node document */
import {nodeType} from './define'
import {filterSupportedDOMNodes, syncDOMNode, syncDOMRange, htmlToDOMNodes, applyProps} from './dom'
import {applyDiff} from './diff'
import {resolve} from './resolve'

const resolveContentHTML = nodes => nodes.reduce(
  (nodes, current) => nodes.concat(
    current.type === nodeType.html
      ? htmlToDOMNodes(current.html)
      : current
  ),
  []
)

const nodeToDOMNode = node => {
  if (node instanceof Node) {
    return node
  }

  if (node.type === nodeType.tag) {
    return document.createElement(node.name)
  }

  return document.createTextNode(node.text)
}

const mountChildren = (node, children) => {
  const eq = (domNode, node) => {
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

  const remove = (list, from, to) => {
    list.slice(from, to).forEach(n => node.removeChild(n))
    list.splice(from, to - from)
    return list
  }

  const insert = (list, at, nodes) => {
    const atNode = list.length > at ? list[at] : null
    const domNodes = nodes.map(nodeToDOMNode)
    domNodes.forEach(n => node.insertBefore(n, atNode))
    list.splice(at, 0, ...domNodes)
    return list
  }

  children = resolveContentHTML(children)
  const domChildren = filterSupportedDOMNodes([...node.childNodes])
  applyDiff(eq, remove, insert, domChildren, children)
  children.forEach((c, i) => mountNode(c, domChildren[i]))
}

const mountTag = (spec, domNode) => {
  // create a function for this check in dom
  const nextDomNode =
    domNode.nodeType !== Node.ELEMENT_NODE ||
    domNode.tagName !== spec.name
    ? document.createElement(spec.name)
    : domNode

  applyProps(nextDomNode, spec.props)
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
  return syncDOMRange(
    domNode.parentNode,
    [domNode],
    htmlToDOMNodes(node.html),
    domNode.nextSibling
  )
}

const mountNode = (node, domNode) => {
  if (node instanceof Node) {
    syncDOMNode(domNode, node)
    return
  }

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
