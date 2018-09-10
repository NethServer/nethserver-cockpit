# Development environment

**Index**

* [Install requirements](#install-requirements)
* [Code style](#code-style)
* [Build API and UI](#build-api-and-ui)
* [Sync API and UI](#sync-api-and-ui)


The development environment can be prepared on a Fedora or CentOS 7 machine.

Follow these steps:

- prepare the environment

- do your modification to API or UI

- sync your modification to the server where cockpit is running

## Install requirements

Prepare the development environment:

- Install developer tools: npm and git

  On Fedora:
  ```
  dnf install npm git
  ```

  On CentOS:
  ```
  yum install npm git
  ```

- Clone the repository:
  ```
  git clone git@github.com:NethServer/nethserver-cockpit
  ```

- Install grunt globally:
  ```
  npm install -g grunt-cli bower generator-angular yo
  ```

  You can ignore warnings like this:
  ```
  WARN generator-angular@0.16.0 requires a peer of generator-karma@>=0.9.0 but none was installed.
  ```


- Enter inside the cloned repository and install all dependencies:
  ```
  cd nethserver-cockpit/

  cd api/ && npm install
  cd ..
  cd ui/system/ && npm install && bower install
  ```

## Build API and UI

Enter API directory and build using grunt:

```
cd api/system/ && grunt build
```

Enter UI directory and build using grunt:

```
cd ui/ && grunt build
```

You can ignore ignore warnings like this:
```
npm WARN api@1.0.0 No repository field.
npm WARN api@1.0.0 No license field.
```


## Sync API and UI

Files can be copied using rsync.

While UI could be synced without executing the `build` task each time,
make sure API is always built before sync.

Use the following commands:

```
ssh root@192.168.1.20  "mkdir -p ~/.local/share/cockpit/nethserver"

cd api/ && grunt build rsync:root@192.168.1.20
cd ui/system && grunt rsync:root@192.168.1.20
```


## Code style

Please use configuration from EditorConfig: http://editorconfig.org

