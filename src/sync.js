function findMatch(eq, from, to) {
	let i
	let j
	mainLoop: for (i = 0; i < from.length; i++) {
		for (j = 0; j < to.length; j++) {
			if (eq(from[i], to[j])) {
				break mainLoop
			}
		}
	}

	return {
		from: i,
		to: j,
	}
}

function findNoMatch(eq, from, to) {
	let i
	for (i = 0; i < from.length && i < to.length; i++) {
		if (!eq(from[i], to[i])) {
			break
		}
	}

	return i
}

// [[insertStart, insertEnd, deleteStart, deleteEnd], ...]
export function getChanges(eq, from, to) {
	const changes = []

	const index = {
		from: 0,
		to: 0,
	}
	let match
	let noMatch
	for (;;) {
		if (index.from === from.length || index.to === to.length) {
			if (index.from < from.length || index.to < to.length) {
				changes.push([index.from, from.length, index.to, to.length])
			}

			return changes
		}

		match = findMatch(eq, from.slice(index.from), to.slice(index.to))
		if (match.from > 0 || match.to > 0) {
			changes.push([index.from, index.from + match.from, index.to, index.to + match.to])
		}

		index.from += match.from
		index.to += match.to

		noMatch = findNoMatch(eq, from.slice(index.from), to.slice(index.to))
		index.from += noMatch
		index.to += noMatch
	}
}

export function syncChanges(insert, remove, from, to, changes) {
	let syncTo = to
	let offset = 0
	for (const c of changes) {
		if (c[2] !== c[3]) {
			syncTo = remove(syncTo, c[2] + offset, c[3] + offset)
			offset += c[2] - c[3]
		}

		if (c[0] !== c[1]) {
			syncTo = insert(syncTo, c[3] + offset, from.slice(c[0], c[1]))
			offset += c[1] - c[0]
		}
	}

	return to
}

export function forEachUnchanged(from, to, changes, proc) {
	let fromStart = 0
	let toStart = 0
	for (const c of changes) {
		if (c[0] > fromStart || c[2] > toStart) {
			for (let i = fromStart; i < c[0]; i++) {
				proc(from[i], to[i + toStart - fromStart])
			}
		}

		fromStart = c[1]
		toStart = c[3]
	}

	if (from.length > fromStart || to.length > toStart) {
		for (let i = fromStart; i < from.length; i++) {
			proc(from[i], to[i + toStart - fromStart])
		}
	}
}

export const sync = (eq, insert, remove, from, to) =>
	syncChanges(insert, remove, from, to, getChanges(eq, from, to))
