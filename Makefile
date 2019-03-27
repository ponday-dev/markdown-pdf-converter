version=2019.1.102

.PHONY: setup
setup:
	./scripts/setup.sh ${version}

.PHONY: render
render:
	./scripts/render.sh

.PHONY: clean
clean:
	rm -rf ./viewer && rm -rf ./public/*
