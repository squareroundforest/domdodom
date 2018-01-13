// const log = (...args) => {
//   console.error(...args)
//   if (args.length === 0) {
//     return
//   }
//
//   return args[args.length - 1]
// }

const nodeType = {
  tag: 0,
  component: 1
}

const escapeHTML = s => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const validateSymbol = s => s // TODO
const attributeName = name => name === 'className' ? 'class' : validateSymbol(name)

const isPropSet = a => a.constructor === Object || Array.isArray(a)
const isChild = a => !isPropSet(a)
const isNode = a => typeof a === 'function'
const getProps = args => args.filter(isPropSet)
const getChildren = args => args.filter(isChild)

// markup:

const attributesMarkup = props => Object.keys(props).reduce(
  (s, name) => s + ` ${attributeName(name)}="${escapeHTML(String(props[name]))}"`,
  ''
)

const childrenMarkup = children => children.map(
  c => isNode(c) ? c(nodeMarkup) : escapeHTML(String(c).trim())
).join('')

const tagMarkup = (nodeDef, props, children) => {
  if (nodeDef.isVoid) {
    return `<${nodeDef.name}${attributesMarkup(props)}>`
  } else {
    return `<${nodeDef.name}${attributesMarkup(props)}>${childrenMarkup(children)}</${nodeDef.name}>`
  }
}

const componentMarkup = (nodeDef, props, children) => {
  const m = nodeDef.component(props, children)
  return isNode(m) ? m(nodeMarkup) : escapeHTML(String(m).trim())
}

const nodeMarkup = (nodeDef, props, children) => {
  const markup = nodeDef.type === nodeType.component
    ? componentMarkup
    : tagMarkup
  return markup(nodeDef, props, children)
}

// dom:

// const tagDOM = (nodeDef, props, children) => {
// }

// const nodeDOM = (nodeDef, props, children) => {
//   const dom = nodeDef.type === nodeType.component
//         ? componentDOM
//         : tagDOM
//   return dom(nodeDef, props, children)
// }

// define:

const node = (nodeDef, props, children) => {
  const n = (...args) => {
    if (args.length === 0) {
      return n
    }

    if (args[0] === inspect) {
      return {
        def: nodeDef,
        props: props,
        children: children
      }
    }

    if (args[0] === nodeMarkup) {
      return nodeMarkup(nodeDef, props, children)
    }

    return node(
      nodeDef,
      Object.assign({}, props, ...getProps(args)),
      [...children, ...getChildren(args)]
    )
  }

  return n
}

const inspect = node => node(inspect)

const defineTag = (name, options) => {
  return node(Object.assign({type: nodeType.tag, name: name}, options), {}, [], [])
}

const defineComponent = (c) => {
  return node({type: nodeType.component, component: c}, {}, [], [])
}

export const define = (d, options) => {
  switch (typeof d) {
    case 'function':
      return defineComponent(d, options)
    case 'string':
      return defineTag(d, options)
    default:
      throw new Error('invalid definition')
  }
}

export const markup = node => node(nodeMarkup)

const tags = 'html, head, meta, script, body, div, ul, li, span, h1, p'
const voidTags = 'br'

export const tag = {}
for (let name of tags.split(/ *, */)) {
  tag[name] = define(name)
}
for (let name of voidTags.split(/ *, */)) {
  tag[name] = define(name, {isVoid: true})
}
