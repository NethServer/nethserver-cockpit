# Building documentation

This guide has been built using [Docma](http://onury.io/docma/) and [Grunt](https://gruntjs.com/).

To build the documentation during the development use:
```
grunt docma
```

The documentation will be generated inside the ``docs`` directory and must be served using
an HTTP server:

1. Move to the root directory of cloned repository and prepare the directory structure:
```
ln -s docs nethserver-cockpit
```

2. Launch an HTTP server using Python or NodeJS:
```
python -m SimpleHTTPServer 8080
```
or
```
http-server
```

3. Access the documentation: http://localhost:8080/nethserver-cockpit

## Publish to GitHub pages

Move to the root directory of cloned repository and
execute:
```
./prep-docs
```

The scripts will build the documentation and commit it to ``gh-pages`` branch.
Generated site can be published using the following command:
```
git push origin gh-pages --force
```

