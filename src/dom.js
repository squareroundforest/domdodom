/* global Node */
import {changeSet, forEachUnchanged, applyChangeSet} from './diff'

const supportedNodeTypes = typeof Node !== 'undefined' ? [Node.ELEMENT_NODE, Node.TEXT_NODE] : []

// TODO: move to dom
const tempNode = typeof document !== 'undefined' ? document.createElement('div') : undefined

const syncAttributes = (current, next) => {
  const currentAttributes = [...current.attributes]
  const nextAttributes = [...next.attributes]
  const nextNames = nextAttributes.map(a => a.name)

  currentAttributes.forEach(a => {
    if (!nextNames.some(n => n === a.name)) {
      current.removeAttribute(a.name)
    }
  })

  nextAttributes.forEach(a => current.setAttribute(a.name, a.value))
}

const syncElement = (current, next) => {
  syncAttributes(current, next)
  syncDOMRange(current, current.childNodes, next.childNodes, null)
}

const syncTextNode = (current, next) => {
  if (current.textContent !== next.textContent) {
    current.textContent = next.textContent
  }
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

export const syncDOMRange = (parent, nodes, nextNodes, before) => {
  const eq = (current, next) => {
    if (current.nodeType !== next.nodeType) {
      return false
    }

    if (current.nodeType === Node.ELEMENT_NODE) {
      return current.tagName === next.tagName
    }

    return true
  }

  const remove = (nodes, from, to) => {
    nodes.slice(from, to).forEach(n => parent.removeChild(n))
    nodes.splice(from, to - from)
    return nodes
  }

  const insert = (nodes, at, nextNodes) => {
    const atNode = nodes.length > at ? nodes[at] : before
    nextNodes.forEach(n => parent.insertBefore(n, atNode))
    nodes.splice(at, 0, ...nextNodes)
    return nodes
  }

  nodes = filterSupportedDOMNodes([...nodes])
  nextNodes = filterSupportedDOMNodes([...nextNodes])
  const changedType = changeSet(eq, nodes, nextNodes)
  forEachUnchanged(nodes, nextNodes, changedType, syncDOMNode)
  applyChangeSet(remove, insert, nodes, nextNodes, changedType)
}

export const syncDOMNode = (current, next) => {
  if (current.nodeType === Node.ELEMENT_NODE) {
    syncElement(current, next)
    return
  }

  syncTextNode(current, next)
}
