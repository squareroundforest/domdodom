import {DefinitionError, inspect, isElement, nodeType} from "./define"
import {attributeName, escapeAttributeValue, escapeHTML} from "./html"

function attributesMarkup(props) {
  return Object.keys(props).reduce(
    (m, name) =>
      `${m} ${attributeName(name)}="${escapeAttributeValue(
        String(props[name])
      )}"`,
    ""
  )
}

function tagMarkup(spec) {
  if (spec.def.isVoid) {
    return `<${spec.def.name}${attributesMarkup(spec.props)}>`
  }
  return (
    `<${spec.def.name}${attributesMarkup(spec.props)}>` +
    `${spec.children.map(markup).join("")}` +
    `</${spec.def.name}>`
  )
}

const textMarkup = node => escapeHTML(String(node))
const htmlMarkup = spec => String(spec.children[0])
const componentMarkup = spec =>
  markup(spec.def.component(spec.props, spec.children))

export function markup(node) {
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
      throw new DefinitionError("unsupported element type")
  }
}

export function markupDoc(node, type) {
  return `<!doctype ${type || "html"}>${markup(node)}`
}
