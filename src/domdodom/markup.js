import {nodeType, inspect, isNode} from './define'
import {escapeHTML, escapeAttribute, attributeName} from './html'

const attributesMarkup = props => Object.keys(props).reduce(
  (s, name) => s + ` ${attributeName(name)}="${escapeAttribute(String(props[name]))}"`,
  ''
)

// TODO: join should be checked to behave similarly with non-nodes as text node siblings

const childrenMarkup = children => children.map(
  c => isNode(c) ? markup(c) : escapeHTML(String(c).trim())
).join('')

const tagMarkup = spec => {
  if (spec.def.isVoid) {
    return `<${spec.def.name}${attributesMarkup(spec.props)}>`
  } else {
    return `<${spec.def.name}${attributesMarkup(spec.props)}>` +
    `${childrenMarkup(spec.children)}` +
    `</${spec.def.name}>`
  }
}

const componentMarkup = (spec) => {
  const m = spec.def.component(spec.props, spec.children)
  return isNode(m) ? markup(m) : escapeHTML(String(m).trim())
}

export const markup = node => {
  const spec = inspect(node)
  const markup = spec.def.type === nodeType.component
    ? componentMarkup
    : tagMarkup
  return markup(spec)
}
