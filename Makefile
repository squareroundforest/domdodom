SOURCE = $(shell find src -name "*.js")
CONFIG = $(shell ls *.js *.json)

default: build

build: server

deps: $(CONFIG)
	yarn install

dist/client/index.js: $(SOURCE) $(CONFIG)
	npx webpack --config webpack.config.client.js src/app dist/client/index.js

dist/index.js: $(SOURCE) $(CONFIG)
	npx webpack --config webpack.config.server.js src/server dist/index.js

client: dist/client/index.js

server: client dist/index.js

run: server
	@node dist --pretty

check: $(SOURCE) $(CONFIG)
	npx jest

check-lint: $(SOURCE) $(CONFIG)
	@npx standard $(SOURCE) *.js

check-deps: deps $(SOURCE) $(CONFIG)
	npx snyk --quiet test

lint: $(SOURCE) $(CONFIG)
	@npx standard --fix $(SOURCE) *.js

check-all: check-lint check-deps
	npx jest --all

precommit: $(SOURCE) $(CONFIG) check-all build

clean:
	rm -rf dist
