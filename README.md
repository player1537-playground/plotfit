# Plotfit

> A tool to analyze neutron scattering in a configurable plotting application.

# Note!

I merged a bunch of repositories together, so if you've already cloned this,
you'll have to reclone it.

# Installing

We have an optional dependency of jshint, so we can install that with:

```bash
$ make depend
```

# Running

To start both a file watcher (to rebuild when files change) and a server, run:

```bash
$ make
```

To just start the server:

```bash
$ make server
```

And to start just the file watcher:

```bash
$ make watcher
```
