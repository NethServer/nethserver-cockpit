# Building documentation

This guide has been built using (Docma)[http://onury.io/docma/] and (Grunt)[https://gruntjs.com/].

To build the documentation during the development use:
```
grunt docma
```

The documentation will be generated inside the ``docs`` directory.

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

