/* global Node */

import {getChanges, forEachUnchanged, syncChanges} from './sync'

// TODO: support for canvas and other media
const supportedNodeTypes = typeof Node !== 'undefined' ? [
  Node.ELEMENT_NODE,
  Node.TEXT_NODE
] : []

// TODO: move to dom
const tempNode = typeof document !== 'undefined' ? document.createElement('div') : undefined

const syncAttributes = (from, to) => {
  const fromAttributes = [...from.attributes]
  const fromNames = fromAttributes.map(a => a.name)
  const toAttributes = [...to.attributes]

  toAttributes.forEach(a => {
    if (!fromNames.some(n => n === a.name)) {
      to.removeAttribute(a.name)
    }
  })

  fromAttributes.forEach(a => to.setAttribute(a.name, a.value))
}

const syncElement = (from, to) => {
  syncAttributes(from, to)
  syncDOMRange(to, from.childNodes, to.childNodes, null)
}

const syncTextNode = (from, to) => {
  if (from.textContent !== to.textContent) {
    to.textContent = from.textContent
  }
}

export const domSyncEq = (from, to) => {
  if (from.nodeType !== to.nodeType) {
    return false
  }

  if (from.nodeType === Node.ELEMENT_NODE) {
    return from.tagName === to.tagName
  }

  return true
}

export const syncInsert = (parent, before, resolveNode) => (nodes, at, insertNodes) => {
  const atNode = nodes.length > at ? nodes[at] : before
  const domNodes = insertNodes.map(resolveNode)
  domNodes.forEach(n => parent.insertBefore(n, atNode))
  nodes.splice(at, 0, ...domNodes)
  return nodes
}

export const syncRemove = (nodes, start, end) => {
  nodes.slice(start, end).forEach(n => n.parentNode.removeChild(n))
  nodes.splice(start, end - start)
  return nodes
}

export const applyProps = (domElement, props) => {
  [...domElement.attributes].forEach(a => {
    if (!(a.name in props)) {
      domElement.removeAttribute(a.name)
    }
  })

  Object.keys(props).forEach(name => domElement.setAttribute(name, props[name]))
}

export const htmlToDOMNodes = html => {
  tempNode.innerHTML = html
  const nodes = filterSupportedDOMNodes([...tempNode.childNodes])
  tempNode.innerHTML = ''
  return nodes
}

export const filterSupportedDOMNodes = nodes => nodes.filter(
  n => supportedNodeTypes.some(
    nt => nt === n.nodeType
  )
)

export const syncDOMRange = (parent, from, to, before) => {
  from = filterSupportedDOMNodes([...from])
  to = filterSupportedDOMNodes([...to])
  const changes = getChanges(domSyncEq, from, to)
  forEachUnchanged(from, to, changes, syncDOMNode)
  syncChanges(syncInsert(parent, before, x => x), syncRemove, from, to, changes)
}

export const syncDOMNode = (from, to) => {
  if (from.nodeType === Node.ELEMENT_NODE) {
    syncElement(from, to)
    return
  }

  syncTextNode(from, to)
}
