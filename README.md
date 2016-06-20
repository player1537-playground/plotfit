# django-webpack-plotfit

Experiment to integrate Vue.js and Vuex.js into a Django application for
plotting and fitting reduced I(Q) data from neutron scattering experiments.

# Installation

We need to setup both Python and JavaScript environments. This also means that
we need to have `virtualenv` for Python and `npm` for JavaScript. At the end, we
also will need to setup our database.

To setup Python we create a virtual environment and then run a `make` command to
install everything.

```bash
python -m pip virtualenv venv
source venv/bin/activate
make depend-python
```

Then we need to install everything for JavaScript with another `make` command.

```bash
make depend-javascript
```

Finally, we need to set up our database. We do this with two more `make`
commands:

```bash
make makemigrations
make migrate
```

# Running the server

We need to have both Django's `runserver` and Webpack's `--watch` commands
running at the same time. This is all done in the standard `make` target. To
kill the server, just Control-C it.

```bash
make
```

# Notes

`make` commands are used to simplify some of the commands needed to type to run
everything, but also so that the process is a little more documented. They
especially excel at running the web server and the webpack watcher. I also
believe that my terminal was having troubles when I would run the `manage.py`
commands directly, and adding `make` as a proxy helped resolve that problem.
