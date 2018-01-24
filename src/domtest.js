/* global expect document Node */

import {markup} from "."

export let root

export const checkDOM = n => expect(document.body.innerHTML).toBe(markup(n))

export function initDOM(n) {
	document.body.innerHTML = markup(n({id: "root"}))
	root = document.getElementById("root")
}

const capturedElementsAndText = captured =>
	captured.filter(c => [Node.ELEMENT_NODE, Node.TEXT_NODE].some(t => t === c.node.nodeType))

export function captureDOM(node) {
	const captured = {node}

	if (node.nodeType === Node.TEXT_NODE) {
		captured.text = node.textContent
	}

	if (node.nodeType === Node.ELEMENT_NODE) {
		captured.children = [...node.childNodes].map(captureDOM)
		captured.attributes = [...node.attributes].map(a => ({
			name: a.name,
			value: a.value,
		}))
	}

	return captured
}

export function capturedEq(prev, next) {
	if (prev.node !== next.node) {
		return false
	}

	if (prev.node.nodeType === Node.TEXT_NODE) {
		return prev.text === next.text
	}

	// we ignore nodes that are not element or text,
	// but we check numeric existence:
	if (prev.children.length !== next.children.length) {
		return false
	}

	const prevNodes = capturedElementsAndText(prev.children)
	const nextNodes = capturedElementsAndText(next.children)
	return (
		prevNodes.every((n, i) => capturedEq(n, nextNodes[i])) &&
		prev.attributes.length === next.attributes.length &&
		prev.attributes.every(pa =>
			next.attributes.some(na => na.name === pa.name && na.value === pa.value)
		)
	)
}
