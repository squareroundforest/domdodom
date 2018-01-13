import {tag} from '../domdodom'

// present top level
// present creating tag with a tag
// rename to tag?
// present a dynamic component
// present data in a tag
// present templating

// phases:
// - define, immutable
// - markup or render

// markup:
// returns html

// render:
// render or mount, and update

// setting props (also tag attributes) creates a new node:
// myTag({"class": "foo"})
// component({data: {"foo": 42}})
// component(["foo", "bar", "baz"])

// setting children creates a new node, too:
// myTag(anotherTag, "text content", new Date)
// component("line one", tag.br, "line two")

// currying style:
// tag.h1({className: "greeting"})("Hello, world!")
// equivalent to: tag.h1({className: "greeting"}, "Hello, world!")
// tag.foo() equivalent to tag.foo
// component() equivalent to component

// inner html: "some html"
// js templates: `"${quoted}"`
// therefore: const quoted = define((_, content) => `"${content}"`)
// all of these escaped

// define a tag:
// const myTag = define("foo")

// define a component:
// const component = define((props, children) => {
//   if (!props.ready) {
//     return ""
//   }
//
//   return tag.div(
//     tag.ul({"class": "my-data"}, ...props.data.map(tag.li)),
//     ...children
//   )
// })

export default tag.html(
  {lang: 'en-US'},
  tag.head(
    tag.meta({charset: 'utf-8'}),
    tag.script({src: 'client/index.js'})
  ),
  tag.body(
    tag.h1('Hello, world!'),
    tag.p('Yes!!!')
  )
)
