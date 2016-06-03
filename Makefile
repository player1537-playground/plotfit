.MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

ifndef PYTHON
PYTHON := $(firstword $(shell which python2 python2.7 python))
endif

export DJANGO_COLORS := nocolor

.PHONY: runserver
runserver:
	cd site1 && $(PYTHON) manage.py runserver

.PHONY: collectstatic
collectstatic:
	cd site1 && $(PYTHON) manage.py collectstatic

.PHONY: depend
depend:
	rm -rf venv
	$(PYTHON) -m virtualenv venv
	source venv/bin/activate && $(PYTHON) -m pip install --user -r requirements.txt
