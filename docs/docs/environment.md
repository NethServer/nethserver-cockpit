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

- Enter inside the cloned repository and install all ui dependencies:

    ```
    cd nethserver-cockpit/ui
    npm install && npm run dev
    ```

## Build UI

Enter UI directory and build using `npm`:

```
cd ui/ && ./prep-sources
```


## Sync API and UI

Files can be copied using rsync.

While UI could be synced without executing the `build` task each time,
make sure API is always built before sync.

Use the following commands:

```
ssh root@192.168.1.20  "mkdir -p ~/.local/share/cockpit/nethserver"

cd api/ && rsync -avz --delete ./* root@192.168.1.20:/usr/libexec/nethserver/api/
cd ui/ && rsync -avz --delete dist/* root@192.168.1.20:/usr/share/cockpit/nethserver/
```

## Code style
Please use configuration from EditorConfig: http://editorconfig.org

