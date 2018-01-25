/* global WeakMap Node */

import {mount} from "./mount"
import {resolve} from "./resolve"

// TODO: handle or document overmount, where a new tree may contain a mounted component

class RenderError extends Error {}

const refCache = new WeakMap()

const isRef = () => false

function renderView(/*view, ref*/) {
  // the ref has the tree, with the dom nodes referenced
  // check the hash
  // if the hash doesn't equal, then type checking is required
  // if view is text, then remove all ref nodes but the first one if it's a text node and set the text
  // if view is tag, then remove all ref nodes but the first one it it's the same tag, and render the tag
  // if view is html, then sync the nodes, like in mount
}

function inspectRef(/*ref*/) {}

// what, where
export function render(view, ref) {
  const refSet = Boolean(ref)
  const isItARef = refSet && isRef(ref)
  const isItANode = refSet && ref instanceof Node

  if (refSet && !isItARef && !isItANode) {
    throw new RenderError(
      "reference must be a render reference or a DOM node"
    )
  }

  // using the body, probably:
  if (!refSet) {
    throw new RenderError("not implemented")
  }

  if (isItARef) {
    return renderView(resolve(view), inspectRef(ref))
  }

  if (isItANode) {
    const cached = refCache.get(ref)
    if (cached) {
      return renderView(resolve(view), cached)
    }
  }

  return mount(view, ref)
}

/*
How to enable in event handlers:
render(this({style: "display: none"}, "new child"))

? what should happen to the existing children in the above case
. receive the previous props and children with the event
*/

/*
decide later:

const comp = define((props, children) => {
  return tag.div(
    {onclick: handler(e => {
      render(e.view)
    }, props, children)},
    ...children
  )
})

const view = render(comp)
*/
