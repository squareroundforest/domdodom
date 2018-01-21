import {nodeType, inspect} from './define'

// const viewChildren = (els, children) => children.forEach(c =>
//   // isNode(c) ?
//   //  view(el, c) :
//   //  el.appendChild(document.createTextNode(String(c).trim()))
//   {}
// )

// TODO: track own attributes

const viewTag = (el, spec) => {
    // el.innerHTML = ""
    // const el = document.createElement(spec.def.name)
    // Object.keys(spec.props).forEach(key => el.setAttribute(
    //   attributeName(key),
    //   escapeHTML(spec.props[key])
    // ))

    // viewChildren(el.children, spec.children)
    // el.appendChild(el)
}

const viewComponent = (el, spec) => {
}

export const view = (el, node) => {
  const spec = inspect(node)
  if (!spec.mounted) {
        // node = mount(el, node)
  }

  const view = spec.def.type === nodeType.component
        ? viewComponent
        : viewTag
  return view(el, spec)
}
