# Dömdödöm

### Markup

Element:

```
markup(p("Hello, world!"))
```

Component:

```
markup(define(() => tag.p("Hello, world!")))
```

Text:

```
markup("Hello, world!")
```

Text will be escaped:

```
markup("<p>Hello, world!</p>")
```

Other types will be converted to text:

```
markup(42)
```

HTML content won't be escaped:

```
markup(htmlContent("<p>Hello, world!</p>"))
```

For documents, doctype will be prepended:

```
markupDoc(
	tag.html(
		tag.head(
			tag.meta({charset: "utf-8"}),
			tag.title("Hello World - Example")
		),
		tag.body(
			tag.p({"class": "greeting"}, "Hello, world!")
		)
	)
)
```

## Mount
