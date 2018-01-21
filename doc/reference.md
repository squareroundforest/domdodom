# Dömdödöm

### Mount

Mount an element in place of a DOM node:

```
render(tag.p("foo"), document.getElementById("placeholder"))
```

Text:

```
render("foo", document.getElementById("placeholder"))
```

Text will be escaped:

```
render("<p>foo</p>", document.getElementById("placeholder"))
```

Other types will be converted to text:

```
render(42, document.getElementById("placeholder"))
```

HTML content won't be escaped:

```
render(htmlContent("<p>foo</p>"), document.getElementById("placeholder"))
```

### Markup

Element:

```
markup(p("foo"))
```

Component:

```
markup(define(() => tag.p("foo")))
```

Text:

```
markup("foo")
```

Text will be escaped:

```
markup("<p>foo</p>")
```

Other types will be converted to text:

```
markup(42)
```

HTML content won't be escaped:

```
markup(htmlContent("<p>foo</p>"))
```

For documents, doctype will be prepended:

```
markupDoc(
	tag.html(
		tag.head(
			tag.meta({charset: "utf-8"}),
			tag.title("Foo - Example")
		),
		tag.body(
			tag.p({"class": "greeting"}, "foo")
		)
	)
)
```
