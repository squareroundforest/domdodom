/* global document Node */

import {
  applyProps,
  filterSupportedDOMNodes,
  htmlToDOMNodes,
  syncEq,
  syncInsert,
  syncNode,
  syncRange,
  syncRemove,
} from "./dom"

import {nodeType} from "./define"
import {resolve} from "./resolve"
import {sync} from "./sync"

function resolveContentHTML(nodes) {
  const domIfHTML = current =>
    current.type === nodeType.html
      ? htmlToDOMNodes(current.html)
      : current
  return nodes.reduce(
    (nodes, current) => nodes.concat(domIfHTML(current)),
    []
  )
}

function mountSyncEq(from, to) {
  if (from instanceof Node) {
    return syncEq(from, to)
  }

  if (from.type === nodeType.tag) {
    return to.nodeType === Node.ELEMENT_NODE && from.name === to.tagName
  }

  return true
}

function nodeToDOMNode(node) {
  if (node instanceof Node) {
    return node
  }

  if (node.type === nodeType.tag) {
    return document.createElement(node.name)
  }

  return document.createTextNode(node.text)
}

function mountChildren(node, children) {
  const resolvedChildren = resolveContentHTML(children)
  const domChildren = filterSupportedDOMNodes([...node.childNodes])
  sync(
    mountSyncEq,
    syncInsert(node, null, nodeToDOMNode),
    syncRemove,
    resolvedChildren,
    domChildren
  )
  resolvedChildren.forEach((c, i) => mountNode(c, domChildren[i]))
}

function mountTag(spec, domNode) {
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

function mountText(node, domNode) {
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

function mountHTML(node, domNode) {
  return syncRange(
    domNode.parentNode,
    htmlToDOMNodes(node.html),
    [domNode],
    domNode.nextSibling
  )
}

function mountNode(node, domNode) {
  if (node instanceof Node) {
    syncNode(node, domNode)
    return
  }

  switch (node.type) {
    case nodeType.text:
      return mountText(node, domNode)
    case nodeType.html:
      return mountHTML(node, domNode)
    default:
      return mountTag(node, domNode)
  }
}

export function mount(node, domNode) {
  return mountNode(resolve(node), domNode)
}
