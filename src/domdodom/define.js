const isPropSet = a => a.constructor === Object
const isChild = a => !isPropSet(a)
const getProps = args => args.filter(isPropSet)
const getChildren = args => args.filter(isChild)

const element = (spec, ...args) => {
  const el = (...args) => {
    if (args.length === 0) {
      return el
    }

    if (args[0] === inspect) {
      return spec
    }

    if (spec.sealed) {
      throw new DefinitionError('sealed element cannot be derived from')
    }

    const children = getChildren(args)
    if (spec.isVoid && children.length > 0) {
      throw new DefinitionError('void element cannot have children')
    }

    return element({
      def: spec.def,
      props: Object.assign({}, spec.props, ...getProps(args)),
      children: [...spec.children, ...children]
    })
  }

  return el(...args)
}

const defineElement = (def, options, ...args) => {
  return element({
    def: Object.assign({}, options, def),
    props: Object.assign({}, ...getProps(args)),
    children: [...getChildren(args)]
  })
}

const defineTag = (name, options, ...args) =>
  defineElement({type: elementType.tag, name: name}, options, ...args)

const defineComponent = (c, options, ...args) =>
  defineElement({type: elementType.component, component: c}, options, ...args)

export const elementType = {
  tag: 0,
  component: 1,
  html: 2
}

export class DefinitionError extends Error {}
export const isElement = a => typeof a === 'function'
export const inspect = element => element(inspect)

// options can be: {isVoid: true, sealed: true}
export const defineWithOptions = (d, options, ...args) => {
  switch (typeof d) {
    case 'function':
      return defineComponent(d, options, ...args)
    case 'string':
      return defineTag(d, options, ...args)
    default:
      throw new Error('invalid definition')
  }
}

export const define = (d, ...args) => defineWithOptions(d, {}, ...args)

export const innerHTML = html => {
  if (isElement(html)) {
    throw new DefinitionError('html element cannot be defined with an element')
  }

  return defineElement({type: elementType.html, sealed: true}, {}, html)
}

export const jsx = () => {}
