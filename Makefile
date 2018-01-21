SOURCE = $(shell find src -name "*.js")
CONFIG = $(shell ls *.js *.json)
BROWSER ?= firefox

build: server

deps: $(CONFIG)
	npm list yarn > /dev/null || npm install yarn
	rm -f package-lock.json
	npx --no-install yarn install

install: deps server

dist/client/index.js: $(SOURCE) $(CONFIG)
	npx --no-install webpack --config webpack.config.client.js src/examples/testpage/app dist/client/index.js

dist/index.js: $(SOURCE) $(CONFIG)
	npx --no-install webpack --config webpack.config.server.js src/examples/testpage/server dist/index.js

client: dist/client/index.js

server: client dist/index.js

run: server
	@node dist --pretty

cover: $(SOURCE) $(CONFIG)
	npx --no-install jest --silent --coverage

showcover: cover
	$(BROWSER) coverage/lcov-report/index.html

check: $(SOURCE) $(CONFIG)
	npx --no-install jest --silent

check-lint: $(SOURCE) $(CONFIG)
	@npx --no-install standard $(SOURCE) *.js

snyk: $(CONFIG)
	npx --no-install snyk --quiet test

check-deps: $(CONFIG)
	@echo snyk currently disabled for test run limitations
	@echo you can run it explicitly by calling 'make snyk'

lint: $(SOURCE) $(CONFIG)
	@npx --no-install standard --fix $(SOURCE) *.js

check-all: check-lint check-deps
	npx --no-install jest --silent --all

precommit: $(SOURCE) $(CONFIG) check-all build

clean:
	rm -rf dist
	rm -rf coverage

clean-all: clean
	rm -rf node_modules
