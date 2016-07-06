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
	while true; do ls -d src/*.html | entr -d make index.html || break; done

index.html: $(wildcard src/*.html)
	cat $^ > $@
