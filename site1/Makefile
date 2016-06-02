.MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

export DJANGO_COLORS := nocolor

.PHONY: runserver
runserver:
	python manage.py runserver

.PHONY: collectstatic
collectstatic:
	python manage.py collectstatic

