# Domdodom

A javascript module for rendering DOM or HTML markup in a reactive style.

### Main Features

- support for server side templating, client side reactive rendering, or universal (isomorphic) applications
- definitions with simple JS functions

### Definition Examples

##### Setting props

Setting props and tag attributes happens by passing an object or an array (or more, in fact) to a node. It
creates a new node, leaving the original (tag.p) unchanged:

```JS
tag.p({"class": "normal-text"})
```

Or:

```JS
myComponent({data: {"foo": 42}})
```

Or:

```JS
myComponent(["foo", "bar", "baz"])
```

##### Setting children

Setting children happens by passing one or more non-props values to a node. Just like the props, it creates a
new node, too:

```JS
tag.div(anotherTag, "text content", new Date)
```

Or:

```JS
myComponent("line one", tag.br, "line two")
```

##### Currying style:

```JS
tag.h1({className: "greeting"})("Hello, world!")
```

...is equivalent to:

```JS
tag.h1({className: "greeting"}, "Hello, world!")
```

Just as:

```JS
tag.span()
myComponent()
```

...are equivalent to:

```JS
tag.span
myComponent
```

##### Inner HTML:

Children of a tag or component can be anything that are not props.

```JS
"This is inner HTML".
```

Or:

```JS
"This an HTML code example: <em>foo</em>."
```

Templates can be used. E.g. a quoting component:

```JS
const quoted = define((_, content) => `"${content}"`)
```

Remember that all of this will be rendered with HTML escaping.

##### Custom tags:

```JS
const myTag = define("mytag")
```

##### Components:

```JS
const myComponent = define((props, children) => {
  if (!props.ready) {
    return ""
  }

  return tag.div(
    tag.ul({"class": "my-data"}, ...props.data.map(tag.li)),
    ...children
  )
})
```

Components, just like tags are represented as stateless, pure functions.
