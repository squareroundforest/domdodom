import {nodeType, inspect} from './define'

const viewTag = (spec) => {
}

const viewComponent = (spec) => {
}

export const view = (dom, node) => {
  const spec = inspect(node)
  const view = spec.def.type === nodeType.component
    ? viewComponent
    : viewTag
  return view(spec)
}
