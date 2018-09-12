# Building documentation

This guide has been built using [MkDocs](https://www.mkdocs.org/) and [Material for MKDocs](https://squidfunk.github.io/mkdocs-material/).

Follow [mkdocs installation instructions](https://www.mkdocs.org/#installation), or just use:
```
pip install --user mkdocs mkdocs-material
```

To serve the documentation during the development use:
```
cd docs && mkdocs serve
```

## Publish to GitHub pages

To build and public the documentation directly to GitHub pages:
```
cd docs && mkdocs gh-deploy
```
