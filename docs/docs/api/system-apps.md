# system-apps

Return information about installed NethServer apps (or modules).

## read

The `action` field must have one of the following values:

- `list`: list all available applications. The list contains only the applications accessible to user running the script.
  Also legacy installed applications are listed.
- `info`: retrieve information of the given application
- `hide-uninstall`: tell if uninstall application command is shown or hidden.
- `launcher`: retrieve data about specific apps without checking user authorization. If an input list of app IDs is not provided then data about pinned apps (i.e. applications added to home page) is returned

Each application object contains 2 special fields:

- `editable`: is set to `1` if the running user is root, `0` otherwise
- `shortcut`: is set to `1` if application is inside the shortcut list, `0` otherwise

The `id` field is the name of the RPM package.

### Input

#### list

Example:
```json
{
  "action": "list"
}
```

#### info

Example:
```json
{
  "action": "info",
  "name": "nethserver-firewall"
}
```

#### hide-uninstall

Example:
```json
{
  "action": "hide-uninstall"
}
```

#### launcher

Example:
```json
{
  "action": "launcher",
  "appIds": [
    "nethserver-mattermost",
    "nethserver-dante"
  ],
  "location": {
    "hostname": "ns7test.nethesis.it",
    "protocol": "https:"
  }
}
```

### Output

#### list

Example:
```bash
[
  {
    "icon": "icon.png",
    "author": {
      "email": "Author's email of NethServer Firewall",
      "url": "https://github.com/NethServer/nethserver-firewall",
      "name": "Author's name of NethServer Firewall"
    },
    "bugs": {
      "url": "https://github.com/NethServer/dev/issues"
    },
    "summary": "Short description of NethServer Firewall",
    "url": "nethserver-firewall",
    "id": "nethserver-firewall",
    "name": "NethServer Firewall",
    "release": {
      "version": "1.0.0"
    },
    "description": "Very very very very very long description of NethServer Firewall",
    "license": "GPL-3.0",
    "tags": [
      "tag1",
      "tag2",
      "tag3"
    ],
    "homepage": "https://github.com/NethServer/nethserver-firewall",
    "provides": [
      "nethserver-firewall"
    ],
    "editable": 1,
    "screenshots": [
      {
        "caption": "Login",
        "image": "http://my.screenshot.org/login.png"
      },
      {
        "caption": "Share data",
        "image": "http://my.screenshot.org/data.png"
      }
    ],
    "shortcut": 1,
    "legacy": 0,
  },
  {
    "icon": "legacy.png",
    "name": "Fail2ban",
    "release": {
      "version": "-"
    },
    "description": "-",
    "legacy": 1,
    "editable": 0,
    "url": "Fail2Ban",
    "id": "nethserver-fail2ban",
    "shortcut": 0
  },
  ...
]
```

#### info 

Example:
```json
{
  "icon": "icon.png",
  "author": {
    "email": "Author's email of NethServer Firewall",
    "url": "https://github.com/NethServer/nethserver-firewall",
    "name": "Author's name of NethServer Firewall"
  },
  "bugs": {
    "url": "https://github.com/NethServer/dev/issues"
  },
  "summary": "Short description of NethServer Firewall",
  "url": "nethserver-firewall",
  "id": "nethserver-firewall",
  "name": "NethServer Firewall",
  "release": {
    "version": "1.0.0"
  },
  "description": "Very very very very very long description of NethServer Firewall",
  "license": "GPL-3.0",
  "tags": [
    "tag1",
    "tag2",
    "tag3"
  ],
  "homepage": "https://github.com/NethServer/nethserver-firewall",
  "provides": [
    "nethserver-firewall"
  ],
  "editable": 1,
  "screenshots": [
    {
      "caption": "Login",
      "image": "http://my.screenshot.org/login.png"
    },
    {
      "caption": "Share data",
      "image": "http://my.screenshot.org/data.png"
    }
  ],
  "shortcut": 1
}
```

#### hide-uninstall

Example:
```bash
{
  "HideUninstall": "enabled"
}
```

#### launcher

Example:
```bash
[
  {
    "pin": 0,
    "icon": "logo.png",
    "bugs": {
      "url": "https://github.com/NethServer/dev/issues"
    },
    "author": {
      "email": "edoardo.spadoni@nethesis.it, giacomo.sanchietti@nethesis.it",
      "url": "https://github.com/NethServer/nethserver-dante",
      "name": "Edoardo Spadoni, Giacomo Sanchietti"
    },
    "summary": "Nethserver integration of nethesisdante project",
    "url": "",
    "id": "nethserver-dante",
    "name": "Report",
    "release": {
      "version": "1.0.0"
    },
    "license": "GPL-3.0",
    "description": "Nethserver integration of nethesisdante project",
    "tags": [
      "report",
      "dante",
      "charts"
    ],
    "homepage": "https://github.com/NethServer/nethserver-dante",
    "provides": [
      "nethserver-dante"
    ],
    "editable": 1,
    "shortcut": 0
  },
  {
    "pin": 0,
    "icon": "logo.png",
    "bugs": {
      "url": "https://github.com/NethServer/dev/issues"
    },
    ...
  }
  ...
]
```

## update

Take an `action` field. Valid actions are:

- `add-shortcut`: add given application to left menu
- `remove-shortcut`: remove given application from the left menu
- `add-pin`: add given application to Nethserver home page
- `remove-pin`: remove given application from Nethserver home page

### Input

##### add-shortcut

Example:
```json
{
  "action": "add-pin",
  "name": "nethserver-firewall"
}
```

##### remove-shortcut

Example:
```json
{
  "action": "remove-pin",
  "name": "nethserver-firewall"
}
```

### Output

Each action returns a standard success or error object.
