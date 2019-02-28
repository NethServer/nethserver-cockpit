# Development environment

**Index**

* [Install requirements](#install-requirements)
* [Code style](#code-style)
* [Build API and US](#build-api-and-ui)
* [Sync API and UI](#sync-api-and-ui)


The development environment can be prepared on a Fedora or CentOS 7 machine.

Follow these steps:

- prepare the environment

- do your modification to API or UI

- sync your modification to the server where Cockpit is running

## Install UI requirements

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
    npm install
    ```

## Build the UI

**Note**: during the development, the UI must run on the NethServer server.
Running the UI on the developer machine will not work due to Cockpit CORS limitations.

**Note**: Requirements: `nodejs >= 10`

Enter UI directory and build using `npm`:

```
cd ui/ && ./prep-sources
```

Make sure to create the `/root/.local/share/cockpit/nethserver` directory inside your NethServer.
You can do it using this command, assuming the NethServer has IP `192.168.1.20`:
```text
ssh root@192.168.1.20  "mkdir -p ~/.local/share/cockpit/nethserver"
```

## Sync API and UI

Files can be copied using rsync.

To copy the APIs, use the following command:
```text
cd api/ && rsync -avz --delete ./* root@192.168.1.20:/usr/libexec/nethserver/api/
```

Before copying the UI, make sure to compile it as explained in the paragraph above.

To copy the UI, use the following command:
```text
cd ui/ && rsync -avz --delete dist/* root@192.168.1.20:~/.local/share/cockpit/nethserver/
```

## Code style

Please use configuration from [EditorConfig](http://editorconfig.org).

