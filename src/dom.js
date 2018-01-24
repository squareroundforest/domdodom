/* global document Node */

import {forEachUnchanged, getChanges, syncChanges} from "./sync"

// TODO: support for canvas and other media
const supportedNodeTypes =
	typeof Node === "undefined"
		? undefined
		: [Node.ELEMENT_NODE, Node.TEXT_NODE]

const tempNode =
	typeof document === "undefined"
		? undefined
		: document.createElement("div")

function syncAttributes(from, to) {
	const fromAttributes = [...from.attributes]
	const fromNames = fromAttributes.map(a => a.name)
	const toAttributes = [...to.attributes]

	toAttributes.forEach(function(a) {
		if (!fromNames.some(n => n === a.name)) {
			to.removeAttribute(a.name)
		}
	})

	fromAttributes.forEach(a => to.setAttribute(a.name, a.value))
}

function syncElement(from, to) {
	syncAttributes(from, to)
	syncRange(to, from.childNodes, to.childNodes, null)
}

function syncTextNode(from, to) {
	if (from.textContent !== to.textContent) {
		to.textContent = from.textContent
	}
}

export function syncEq(from, to) {
	if (from.nodeType !== to.nodeType) {
		return false
	}

	if (from.nodeType === Node.ELEMENT_NODE) {
		return from.tagName === to.tagName
	}

	return true
}

export const syncInsert = (parent, before, resolveNode) =>
	function(nodes, at, insertNodes) {
		const atNode = nodes.length > at ? nodes[at] : before
		const domNodes = insertNodes.map(resolveNode)
		domNodes.forEach(n => parent.insertBefore(n, atNode))
		nodes.splice(at, 0, ...domNodes)
		return nodes
	}

export function syncRemove(nodes, start, end) {
	nodes
		.slice(start, end)
		.forEach(n => n.parentNode.removeChild(n))
	nodes.splice(start, end - start)
	return nodes
}

export function applyProps(domElement, props) {
	;[...domElement.attributes].forEach(function(a) {
		if (!(a.name in props)) {
			domElement.removeAttribute(a.name)
		}
	})

	Object.keys(props).forEach(name =>
		domElement.setAttribute(name, props[name])
	)
}

export function htmlToDOMNodes(html) {
	tempNode.innerHTML = html
	const nodes = filterSupportedDOMNodes([...tempNode.childNodes])
	tempNode.innerHTML = ""
	return nodes
}

export const filterSupportedDOMNodes = nodes =>
	nodes.filter(n =>
		supportedNodeTypes.some(nt => nt === n.nodeType)
	)

export function syncRange(parent, from, to, before) {
	const fromSupported = filterSupportedDOMNodes([...from])
	const toSupported = filterSupportedDOMNodes([...to])
	const changes = getChanges(syncEq, fromSupported, toSupported)
	forEachUnchanged(fromSupported, toSupported, changes, syncNode)
	syncChanges(
		syncInsert(parent, before, x => x),
		syncRemove,
		fromSupported,
		toSupported,
		changes
	)
}

export function syncNode(from, to) {
	if (from.nodeType === Node.ELEMENT_NODE) {
		syncElement(from, to)
		return
	}

	syncTextNode(from, to)
}
