# Domdodom

A javascript module for rendering DOM or HTML markup in a reactive style.

### Main Features

- support for server side templating, client side reactive rendering, or universal (isomorphic) applications
- definitions with simple, declarative JS functions

### Definition Examples

##### Setting props

Setting props and tag attributes happens by passing an object to a node. It creates a new node, leaving the
original (tag.p) unchanged:

```
tag.p({"class": "normal-text"})
```

Or:

```
myComponent({data: {"foo": 42}})
```

Or:

```
myComponent(["foo", "bar", "baz"])
```

##### Setting children

Setting children happens by passing one or more non-props values to a node. Just like the props, it creates a
new node, too:

```
tag.div(anotherTag, "text content", new Date)
```

Or:

```
myComponent("line one", tag.br, "line two")
```

##### Currying style:

```
tag.h1({className: "greeting"})("Hello, world!")
```

...is equivalent to:

```
tag.h1({className: "greeting"}, "Hello, world!")
```

Just as:

```
tag.span()
myComponent()
```

...are equivalent to:

```
tag.span
myComponent
```

##### Inner HTML:

Children of a tag or component can be anything that are not props.

```
"This is inner HTML".
```

Or:

```
"This an HTML code example: <em>foo</em>."
```

Templates can be used. E.g. a quoting component:

```
const quoted = define((_, content) => `"${content}"`)
```

Remember that all of this will be rendered with HTML escaping.

##### Custom tags:

```
const myTag = define("mytag")
```

##### Components:

```
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

Components, just like tags are represented as stateless functions.
