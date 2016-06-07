.MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

ifndef PYTHON
PYTHON := $(firstword $(shell which python2 python2.7 python))
endif

export DJANGO_COLORS := nocolor

.PHONY: runserver
runserver: site1/app1/static/data/.INTERMEDIATE
	cd site1 && $(PYTHON) manage.py runserver

.PHONY: collectstatic
collectstatic:
	cd site1 && $(PYTHON) manage.py collectstatic

.PHONY: depend
depend:
	$(PYTHON) -m pip install --user -r requirements.txt


raw/IPTS-15041/.INTERMEDIATE: IPTS-15041.tar.gz
	@mkdir -p $(dir $@)
	tar xf $< -C $(dir $@)
	touch $@

sectioned/IPTS-15041/.INTERMEDIATE: raw/IPTS-15041/.INTERMEDIATE
	re='.*(67[0-9][0-9][0-9]|68[0-9][0-9][0-9]).*'; \
	for f in $(dir $<)*; do \
		[[ $$f =~ $$re ]] && x=$${BASH_REMATCH[1]}; \
		mkdir -p $(dir $@)$$x; \
		awk 'BEGIN { FS="\t"; OFS=","; print "Q","I","dev"; } NR>2 { print $$1,$$2,$$3; }' $$f > $(dir $@)$$x/$${f##*/}; \
	done
	touch $@

site1/app1/static/data/.INTERMEDIATE: sectioned/IPTS-15041/.INTERMEDIATE
	find $(dir $<) -name '*_frame1_Iq.txt' -exec cp {} $(dir $@) \;

.PHONY: clean
clean:
	rm -rf -- raw/ sectioned/ site1/app1/static/data/*_frame1_Iq.txt
