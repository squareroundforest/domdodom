function propNames(props) {
	const renamed = {}
	Object.keys(props).forEach(name => (renamed[name === "className" ? "class" : name] = props[name]))

	return renamed
}

const isProps = a => a.constructor === Object
const isChild = a => !isProps(a)
const getProps = args => args.filter(isProps).map(propNames)
const getChildren = args => args.filter(isChild)

// TODO:
// - support base props during definition (for classes)?
// - verify supported node types
// - how to have multiple handlers? shall we allow it?

function element(spec, ...args) {
	function el(...args) {
		if (args.length === 0) {
			return el
		}

		if (args[0] === inspect) {
			return spec
		}

		if (spec.def.sealed) {
			throw new DefinitionError("sealed element cannot be derived from")
		}

		const children = getChildren(args)
		if (spec.def.isVoid && children.length > 0) {
			throw new DefinitionError("void element cannot have children")
		}

		return element({
			def: spec.def,
			props: Object.assign({}, spec.props, ...getProps(args)),
			children: [...spec.children, ...children],
		})
	}

	return el(...args)
}

const defineElement = (def, options, ...args) =>
	element({
		def: Object.assign({}, options, def),
		props: Object.assign({}, ...getProps(args)),
		children: [...getChildren(args)],
	})

const defineTag = (name, options, ...args) =>
	defineElement(
		{
			type: nodeType.tag,
			name,
		},
		options,
		...args
	)

const defineComponent = (c, options, ...args) =>
	defineElement(
		{
			type: nodeType.component,
			component: c,
		},
		options,
		...args
	)

export const nodeType = {
	tag: 0,
	component: 1,
	text: 2,
	html: 3,
}

export class DefinitionError extends Error {}
export const isElement = a => typeof a === "function"
export const inspect = element => element(inspect)

// TODO: why can't this just be props
// options can be: {isVoid: true, sealed: true}
export function defineWithOptions(d, options, ...args) {
	switch (typeof d) {
		case "function":
			return defineComponent(d, options, ...args)
		case "string":
			return defineTag(d, options, ...args)
		default:
			throw new DefinitionError("invalid definition")
	}
}

export const define = (d, ...args) => defineWithOptions(d, {}, ...args)

export function htmlContent(html) {
	if (isElement(html)) {
		throw new DefinitionError("html element cannot be defined with an element")
	}

	return defineElement(
		{
			type: nodeType.html,
			sealed: true,
		},
		{},
		html
	)
}

export function jsx() {}
