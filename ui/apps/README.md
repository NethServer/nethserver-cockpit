# apps

NethServer UI Applications module

This project is generated with [yo cockpit generator](https://github.com/edospadoni/generator-cockpit).

## Development

Install `generator angular` and `bower` to scaffold AngularJS stuffs:
```
npm install -g generator-angular bower
```

You can use the yeoman [generator-angular](https://github.com/yeoman/generator-angular) to create all AngularJS stuffs like `routes`, `controllers`, `directives`, etc.

For example, use this command in the project root directory to generate a new AngularJS stuff:
```
yo angular:route myroute
```
```
yo angular:controller UserController
```
```
yo angular:directive myDirective
```

Run this to sync your local data into remote host path:
```
grunt sync:_USER_@_DOMAIN_:_PORT_:_FULL_PATH_OF_COCKPIT_MODULE
```

For an easy sync you can use:
```
watch -n1 grunt sync:root@mydomain.com:2222:.local/share/cockpit/mycoolmodule/ --no-color
```

When you developing, sync also all the `bower_components` folder each time a new dependencies is installed, you can sync with:
```
grunt sync:_USER_@_DOMAIN_:_PORT_:_FULL_PATH_OF_COCKPIT_MODULE:all
```
Like above:
```
grunt sync:root@mydomain.com:2222:.local/share/cockpit/mycoolmodule/:all
```

## Build
Run `grunt build` for building and minifiyng all stuff. Then copy it on your cockpit module path to get a compressed web app running AngularJS