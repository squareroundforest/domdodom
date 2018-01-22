/* global Node */

import {nodeType} from './define'
import {sync} from './sync'
import {resolve} from './resolve'

import {
  filterSupportedDOMNodes,
  syncDOMNode,
  syncDOMRange,
  htmlToDOMNodes,
  applyProps,
  domSyncEq,
  syncInsert,
  syncRemove
} from './dom'

const resolveContentHTML = nodes => nodes.reduce(
  (nodes, current) => nodes.concat(
    current.type === nodeType.html
      ? htmlToDOMNodes(current.html)
      : current
  ),
  []
)

const mountSyncEq = (from, to) => {
  if (from instanceof Node) {
    return domSyncEq(from, to)
  }

  if (from.type === nodeType.tag) {
    return (
      to.nodeType === Node.ELEMENT_NODE &&
      from.name === to.tagName
    )
  }

  return true
}

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
  children = resolveContentHTML(children)
  const domChildren = filterSupportedDOMNodes([...node.childNodes])
  sync(mountSyncEq, syncInsert(node, null, nodeToDOMNode), syncRemove, children, domChildren)
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
    htmlToDOMNodes(node.html),
    [domNode],
    domNode.nextSibling
  )
}

const mountNode = (node, domNode) => {
  if (node instanceof Node) {
    syncDOMNode(node, domNode)
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
