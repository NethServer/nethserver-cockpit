# Tutorial

This document describes how to create a new application from scratch.

A NethServer Cockpit module is composed by 5 parts:

- UI: a mix of HTML and CSS which presents data loaded using JavaScript (Cockpit API or NethServer API)
- API: a list of helpers to do actions: `read` - `validate` - `update`
- Package files: manifest and RPM spec file to create an installable package
- Translation files (optional)
- An [application manifest](application_manifest.md)

## Install required tools

Let's assume you've already prepared your own [development environment](environment.md).

```
git clone git@github.com:NethServer/nethserver-cockpit-empty.git your-own-module

cd your-own-module
.
├── api
│   ├── read
│   ├── update
│   └── validate
├── COPYING
├── createlinks
├── nethserver-cockpit-empty.json
├── nethserver-cockpit-empty.spec
├── prep-sources
├── README.md
└── ui
    ├── css
    │   └── style.css
    ├── dev
    │   ├── cockpit.min.js
    │   ├── jquery.min.js
    │   └── patternfly.css
    ├── i18n
    │   └── language.json
    ├── index.html
    ├── js
    │   ├── app.js
    │   └── lib
    │       ├── sammy.js
    │       └── sammy.template.js
    ├── logo.png
    ├── manifest.json
    ├── override.json
    └── views
        ├── about.html
        ├── dashboard.html
        ├── item1.html
        └── logs.html

8 directories, 26 files
```

## Build

NethServer provides a set of tool for building RPMs under CentOS or Fedora.
[Prepare the build environment](http://docs.nethserver.org/projects/nethserver-devel/en/latest/building_rpms.html),
 then create the RPM for your module:

#### Change occurencies
Sobsitute all `nethserver-cockpit-empty` and `NethServer Cockpit Empty` occurencies with `your-own-module` and `Your Own Module`, to check all occurencies:

```
grep -Rn 'nethserver-cockpit-empty' *
grep -Rn 'NethServer Cockpit Empty' *
```

Rename also `nethserver-cockpit-empty-json` and `nethserver-cockpit-empty-spec` with `your-own-module.json` and `your-own-module.spec`.

#### Build the module:
```
./prep-sources
make-rpms your-own-module.spec
```

Then you have `rpm` builded inside the directory, install it, inside NethServer machine with
```
scp your-own-module-x.y.z-t.ns7.noarch.rpm root@192.168.1.20:

ssh root@192.168.1.20

yum install your-own-module-x.y.z-t.ns7.noarch.rpm
```

You can see the module in action by accessing Cockpit: `https://<your_server>:9090`, in the `Applications` section.

If some JavaScript or HTML part doesn't load correctly, execute:
```
systemctl restart cockpit
```

## Customize

Edit all [application metadata](application_manifest.md) inside the manifest:
```
your-own-module.json
```

It's now time to start implementing some nice feature, you just need to know HTML, CSS and some JavaScript basics:
there is no need to learn a new framework, use whatever you like.

The source code must be placed inside the `app` directory:

- `index.html`: main HTML template, contains the navbar left menu with 3 base sections:
   - Dashboard
   - Item 1 (can be customizable)
   - Logs
   - About
- `css/style.css`: application stylesheet, customize your custom CSS but always follow [UI guidelines](ui_guidelines.md)
- `js/app.js`: JavaScript logic goes here. If you need to develop complex API, take a loot to [API guidelines](api_guidelines.md)
- `views/*.html`: contains views for each routes defined in app.js

You can ignore `manifest.json` and `override.json` files which are used for Cockpit internals (change only name inside with `your-own-module`).


- The module UI will be installed inside `/usr/share/cockpit/<project>` directory.
- The module API will be installed inside `/usr/libexec/nethserver/api/<project>` directory.
- Metadata will be copied inside `/usr/share/nethserver/applications` directory.

A new application card named as your project will be added to the `Applications` page.

### JavaScript frameworks

The module provides a very small and easy routing system and javascipt API but in case you really want to pick a JavaScript framework, just include it inside `index.html`.

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
