import {nodeType, inspect, isElement, DefinitionError} from './define'
import {escapeHTML, escapeAttribute, attributeName} from './html'

const attributesMarkup = props => Object.keys(props).reduce(
  (s, name) => s + ` ${attributeName(name)}="${escapeAttribute(String(props[name]))}"`,
  ''
)

const tagMarkup = spec => {
  if (spec.def.isVoid) {
    return `<${spec.def.name}${attributesMarkup(spec.props)}>`
  } else {
    return `<${spec.def.name}${attributesMarkup(spec.props)}>` +
      `${spec.children.map(markup).join('')}` +
      `</${spec.def.name}>`
  }
}

const componentMarkup = spec => markup(spec.def.component(spec.props, spec.children))
const textMarkup = node => escapeHTML(String(node))
const htmlMarkup = spec => String(spec.children[0])

export const markup = node => {
  if (!isElement(node)) {
    return textMarkup(node)
  }

  const spec = inspect(node)
  switch (spec.def.type) {
    case nodeType.tag:
      return tagMarkup(spec)
    case nodeType.component:
      return componentMarkup(spec)
    case nodeType.html:
      return htmlMarkup(spec)
    default:
      throw new DefinitionError('unsupported element type')
  }
}

export const markupDoc = (node, type) => `<!doctype ${type || 'html'}>${markup(node)}`
