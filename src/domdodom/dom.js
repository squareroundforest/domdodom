/* global Node */
import {changeSet, getUnchanged, applyChangeSet} from './diff'

const supportedNodeTypes = [Node.ELEMENT_NODE, Node.TEXT_NODE]

const nodeTypeEq = (current, next) => {
  if (current.nodeType !== next.nodeType) {
    return false
  }

  if (current.nodeType === Node.ELEMENT_NODE) {
    return current.tagName === next.tagName
  }

  return true
}

const syncAttributes = (current, next) => {
  const nextAttributes = [...next.attributes]
  const nextNames = nextAttributes.map(a => a.name)
  Array.from(current.attributes).forEach(a => {
    if (!nextNames.some(n => n === a.name)) {
      current.removeAttribute(a.name)
    }
  })

  nextAttributes.forEach(a => current.setAttribute(a.name, a.value))
}

const syncElement = (current, next) => {
  syncAttributes(current, next)
  syncDOMNodes(current, next.childNodes)
}

const syncTextNode = (current, next) => {
  current.textContent = next.textContent
}

export const filterSupportedDOMNodes = nodes => nodes.filter(n => supportedNodeTypes.some(nt => nt === n.nodeType))

export const syncDOMNodes = (parent, nodes, nextNodes) => {
  const remove = (nodes, from, to) => {
    nodes.slice(from, to).forEach(n => parent.removeChild(n))
    nodes.splice(from, to - from)
    return nodes
  }

  const insert = (nodes, at, nextNodes) => {
    const atNode = nodes.length > at ? nodes[at] : null
    nextNodes.forEach(n => parent.insertBefore(n, atNode))
    nodes.splice(at, 0, ...nextNodes)
    return nodes
  }

  nodes = filterSupportedDOMNodes([...nodes])
  nextNodes = filterSupportedDOMNodes([...nextNodes])
  const changedType = changeSet(nodeTypeEq, nodes, nextNodes)
  const unchanged = getUnchanged(nodes, nextNodes, changedType)
  unchanged.current.forEach((n, i) => syncDOMNode(n, unchanged.next[i]))
  applyChangeSet(remove, insert, nodes, nextNodes, changedType)
}

export const syncDOMNode = (current, next) => {
  if (current.nodeType === Node.ELEMENT_NODE) {
    syncElement(current, next)
    return
  }

  syncTextNode(current, next)
}
