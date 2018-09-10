# How to write a new module

A NethServer Cockpit module is composed by 3 main parts:

- Web interface: a mix of HTML and CSS which presents data loaded using JavaScript Cockpit or NethServer API
- Package files: manifest and RPM spec file to create an installable package
- Translation files (optional)

To scaffold a new module use [NethServer Cockpit Generator](https://github.com/NethServer/generator-nethserver-cockpit) for [Yeoman](http://yeoman.io).

## Install required tools

Let's assume you've already prepared your own [development environment](./environment),
you can now proceed by installing Yeoman and `generator-nethserver-cockpit` using [npm](https://www.npmjs.com/):

```
npm install -g yo
npm install -g generator-nethserver-cockpit
```

## Create

When scaffolding a new module, Yeoman will create the whole structure of 
a new NethServer Cockpit application, including all files needed for building an RPM.
First, create a new directory for your project:
```
mkdir -p nethserver-cockpit-dummy
```

Then execute Yeoman and follow instructions on the screen specifying a meaningful project name:

```
cd nethserver-cockpit-dummy
yo nethserver-cockpit
```

## Customize

Edit all [application metadata](application_manifest.md) inside the manifest:
``` 
root/usr/share/cockpit/nethserver/applications/nethserver-cockpit-dummy.json
```

It's now time to start implementing some nice feature, you just need to know HTML, CSS and some JavaScript basics:
there is no need to learn a new framework, use whatever you like.

The source code must be placed inside the `app` directory:

- `index.html`: main HTML template, it already contains 3 sections:
   - module dashboard on the top
   - application metadata on the right
   - settings on the center
- `styles/main.css`: application stylesheet, customize your custom CSS but always follow [UI guidelines](./ui_guidelines) 
- `scripts/app.js`: JavaScript logic goes here. If you need to develop complex API, take a loot to [API guidelines](./api_guidelines)
- `assets/icon.png`: an icon for your application, we suggest to use a PNG image, 256 x 256 pixel

You can ignore `i18n/po.tpl`, `manifest.json` and `override.json` files which are used for Cockpit internals.

The module will be installed inside `/usr/share/cockpit/<project>` directory.
Metadata will be copied inside `/usr/share/nethserver/applications` directory.

A new application card named as your project will be added to the "Applications" page. 

### JavaScript frameworks

In case you really want to pick a JavaScript framework, just include it inside `index.html`.
The `prep-sources` script will do all the magic for you and include all needed dependencies.

**AngularJS** (https://angularjs.org/):
```
<html ng-app>
...
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js"></script>
```

**Vue** (https://vuejs.org/):
```
<script src="https://unpkg.com/vue"></script>
```

**React** (https://reactjs.org/):
```
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```


## Save your work

The code should always be kept under a version control system for tracking changes.
NethServer build system assumes you're using [git](https://git-scm.com/docs/gittutorial),
so commit everything on a git repository:

```
git init
git add *
git commit -a -m "First import"
```

Always consider to share your code, take a look at [GitHub](https://github.com/).

## Build and test

NethServer provides a set of tool for building RPMs under CentOS or Fedora.
[Prepare the build environment](http://docs.nethserver.org/projects/nethserver-devel/en/latest/building_rpms.html),
 then create the RPM for your module: 

```
./prep-sources
make-rpms nethserver-cockpit-dummy.spec
```

Copy the created RPM into your machine and install it to try out your new application 
by accessing Cockpit: `https://<your_server>:9090`

If some JavaScript or HTML part doesn't load correctly, execute:
```
systemctl restart cockpit
```
