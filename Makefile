SOURCE = $(shell find src -name "*.js")
CONFIG = $(shell ls *.js *.json)

default: server

dist/client/index.js: $(SOURCE) $(CONFIG)
	npx webpack --config webpack.config.client.js src/app dist/client/index.js

dist/index.js: $(SOURCE) $(CONFIG)
	npx webpack --config webpack.config.server.js src/server dist/index.js

client: dist/client/index.js

server: client dist/index.js

run: server
	@node dist --pretty

check: $(SOURCE) $(CONFIG)
	@echo "check"

check-fmt: $(SOURCE) $(CONFIG)
	npx standard $(SOURCE) *.js

check-deps: $(SOURCE) $(CONFIG)
	npx snyk --quiet test

fmt: $(SOURCE) $(CONFIG)
	npx standard --fix $(SOURCE) *.js

check-all: check check-fmt check-deps

precommit: $(SOURCE) $(CONFIG) check-all

clean:
	rm -rf dist
