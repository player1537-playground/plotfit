MAKEFLAGS += --warn-undefined-variables
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

# Environment variables

ifndef NPM
NPM := $(firstword $(shell which npm 2>/dev/null))
endif

ifndef SERVER
SERVER := python3 -m http.server 8888
endif

ifndef ENTR
ENTR := $(firstword $(shell which entr scripts/entr.bash 2>/dev/null))
endif

ifndef JSHINT
JSHINT := $(firstword $(shell which jshint node_modules/.bin/jshint 2>/dev/null))
endif

# Standard Targets

.PHONY: all
all:
	+$(MAKE) -j 2 watcher server

.PHONY: depend
depend:
	npm install

.PHONY: check
check: $(wildcard src/*.html)
ifneq ($(JSHINT),)
	$(JSHINT) --extract=auto $^
else
	@echo "No jshint installed"
endif

# Application-specific targets

.PHONY: server
server:
	$(SERVER)

.PHONY: watcher
watcher:
	trap exit INT TERM; \
	while true; do ls -d src/*.html | $(ENTR) -d -r $(MAKE) check index.html; done
	rm index.html
	false

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

# Source transformations

index.html: $(sort $(wildcard src/*.html))
	find . -name '*~' -exec rm {} \+
	cat $^ > $@
