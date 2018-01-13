import {nodeType, inspect, isNode} from './define'

const escapeHTML = s => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const validateSymbol = s => s // TODO
const attributeName = name => name === 'className' ? 'class' : validateSymbol(name)

const attributesMarkup = props => Object.keys(props).reduce(
  (s, name) => s + ` ${attributeName(name)}="${escapeHTML(String(props[name]))}"`,
  ''
)

const childrenMarkup = children => children.map(
  c => isNode(c) ? markup(c) : escapeHTML(String(c).trim())
).join('')

const tagMarkup = (def, props, children) => {
  if (def.isVoid) {
    return `<${def.name}${attributesMarkup(props)}>`
  } else {
    return `<${def.name}${attributesMarkup(props)}>${childrenMarkup(children)}</${def.name}>`
  }
}

const componentMarkup = (def, props, children) => {
  const m = def.component(props, children)
  return isNode(m) ? markup(m) : escapeHTML(String(m).trim())
}

export const markup = (node) => {
  const {def, props, children} = inspect(node)
  const markup = def.type === nodeType.component
      ? componentMarkup
      : tagMarkup
  return markup(def, props, children)
}
