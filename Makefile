MAKEFLAGS += --warn-undefined-variables
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

ifndef SERVER
SERVER := python3 -m http.server 8888
endif

all:
	$(MAKE) -j 2 watcher server

.PHONY: server
server:
	$(SERVER)

.PHONY: watcher
watcher:
	trap exit INT TERM; \
	while true; do ls -d src/*.html | entr -d -r make index.html; done
	rm index.html
	false

.PHONY: check
check: $(wildcard src/*.html)
	jshint --extract=auto $^

.PHONY: renumber
renumber:
	mkdir src2
	for f in src/*.html; do \
		git ls-files "$$f" --error-unmatch || exit 1; \
	done
	i=0; \
	for f in src/*.html; do \
		x=$$(printf "src2/%03d-$${f#*-}" "$$i"); \
		git mv "$$f" "$$x"; \
		i=$$((i+5)); \
	done
	rm -r src
	git mv src2 src

index.html: $(wildcard src/*.html)
	find . -name '*~' -exec rm {} \+
	cat $^ > $@
