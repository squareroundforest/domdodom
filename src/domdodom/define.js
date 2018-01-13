const isPropSet = a => a.constructor === Object
const isChild = a => !isPropSet(a)
const getProps = args => args.filter(isPropSet)
const getChildren = args => args.filter(isChild)

const node = (spec) => {
  const n = (...args) => {
    if (args.length === 0) {
      return n
    }

    if (args[0] === inspect) {
      return spec
    }

    return node({
      def: spec.def,
      props: Object.assign({}, spec.props, ...getProps(args)),
      children: [...spec.children, ...getChildren(args)]
    })
  }

  return n
}

const defineTag = (name, options) => {
  return node({
    def: Object.assign({type: nodeType.tag, name: name}, options),
    props: {},
    children: []
  })
}

const defineComponent = (c) => {
  return node({type: nodeType.component, component: c}, {}, [])
}

export const nodeType = {
  tag: 0,
  component: 1
}

export const isNode = a => typeof a === 'function'
export const inspect = node => node(inspect)

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
