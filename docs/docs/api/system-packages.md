# system-packages

Manage install/uninstall of applications (YUM groups) and system updates.

## read

### Input

Take an `action` field. Valid actions are:

- `list-available`: list not installed applications
- `list-updates`: calculate the list of dependencies which will be removed along with given packages
- `list-removed`: list the packages which will be removed
- `changelog`: retrieve the changelog of all updates
- `get-config`: retrieve yum-cron and NsReleaseLock configuration

#### list-available

Example:
```json
{
  "action": "list-available"
}
```

#### list-updates

Example:
```json
{
  "action": "list-updates"
}
```

#### list-removed

The `packages` field must contain an array of group or packages which will be removed.
The command will list all packages removed as dependencies.

Example:
```json
{
  "action": "list-removed",
  "packages": ["nethserver-base", "@nethserver-web"]
}
```

#### changelog

Example:
```json
{
  "action": "changelog",
}
```

#### get-config

Example:
```json
{
  "action": "get-config",
}
```


### Output

#### list-available

List all YUM categories and installed groups.

Example:
```json
{
  "categories": [
    {
      "description": "UTM Firewall",
      "color": "#222",
      "name": "Firewall",
      "id": "firewall",
      "icon": "applications/firewall.png"
    },
    ...
  ],
  "groups": [
    {
      "optional_packages": {},
      "conditional_packages": {},
      "name": "Backup",
      "mandatory_packages": {
        "nethserver-backup-data": true,
        "nethserver-backup-config": true,
        "nethserver-restore-data": false
      },
      "description": "Backup of configuration and data",
      "id": "@nethserver-backup",
      "default_packages": {},
    },
    ...
   ]
  }
```

#### list-updates

Retrieve the list of available updates.

Special `nethserver` fiels is set to `true` if the groups comes fron NethServer repositories.

Example:
```json
{
  "updates": [
    {
      "nethserver": false,
      "description": "CentOS minimal package set",
      "updates": [
        {
          "repo": "updates",
          "epoch": "0",
          "version": "2018f",
          "name": "tzdata",
          "release": "2.el7",
          "arch": "noarch",
          "installed_version": "2018e",
          "installed_release": "3.el7"
        },
        ...
      ],
      "id": "@centos-minimal",
      "name": "CentOS-minimal"
    },
    {
      "nethserver": true,
      "description": "NethServer core packages",
      "updates": [
        {
          "repo": "nethserver-updates",
          "epoch": "0",
          "version": "1.2.16",
          "name": "nethserver-lang-en",
          "release": "1.ns7",
          "arch": "noarch",
          "installed_version": "1.2.15",
          "installed_release": "1.ns7"
        },
        ...
      ],
      "id": "core",
      "name": "NethServer core"
    },
    {
      "nethserver": true,
      "description": "Other packages",
      "updates": [
        {
          "repo": "epel",
          "epoch": "0",
          "version": "5.8.1",
          "name": "collectd",
          "release": "1.el7",
          "arch": "x86_64",
          "installed_version": "5.8.0",
          "installed_release": "4.el7"
        },
        ...
      ],
      "id": "other",
      "name": "Other"
    }
  ]
}
```

#### list-remove

Example:
```json
{
  "packages": [
    "nethserver-fail2ban"
  ]
}

```

#### changelog

Retrieve the last changelog entry of the given package update.

Example:
```json
{
  "data": "Loaded plugins: changelog, fastestmirror, nethserver_events\nLoading mirror speeds from cached hostfile\n * base: mirror.crazynetwork.it\n * epel: mirror.infonline.de\n * extras: mirror.crazynetwork.it\n * nethforge: server.liftingtrade.hu\n * nethserver-base: server.liftingtrade.hu\n * nethserver-updates: server.liftingtrade.hu\n * updates: mirror.crazynetwork.it\n\nListing 1 changelog\n\n==================== Updated Packages ====================\nnethserver-lang-en-1.2.16-1.ns7.noarch   nethserver-updates\n* Wed Nov 14 13:00:00 2018 Davide Principi <davide.principi@nethesis.it> - 1.2.16-1\n- Pull strings from Transifex\n\nchangelog stats. 1 pkg, 1 source pkg, 1 changelog\n"
}
```

#### get-config

Example:
```json
{
  "messages": "yes",
  "NsReleaseLock": "disabled",
  "applyUpdate": "no",
  "download": "yes"
}
```

## update

Available actions:

- `update`: update one or more packages
- `install`: install one or more packages
- `remove`: remove one or more packages
- `set-config`: configure NsReleaseLock and yum-cron

### Input

The `packages` field contains a list of packages or group to be updated.
If `packages` field is empty, all packages will be updated.

#### update

If `packages` is empty, update all packages.

Example:
```json
{
  "action": "update",
  "packages": ["@nethserver-httpd", "nethserver-base"],
}
```

#### install

Example:
```json
{
  "action": "install",
  "packages": ["@nethserver-httpd", "nethserver-base"],
}
```

#### remove

Example:
```json
{
  "action": "remove",
  "packages": ["@nethserver-httpd", "nethserver-base"],
}
```

#### set-config

Example:
```json
{
  "action": "set-config",
  "messages": "yes",
  "NsReleaseLock": "disabled",
  "applyUpdate": "no",
  "download": "yes"
}
```

### Output

#### update

Output yum transaction in JSON format:

Example:
```json
{"state": "running", "steps": -1, "event": "Initialization"}
{"state": "running", "steps": -1, "event": "Resolving RPM dependencies"}
{"state": "running", "steps": -1, "event": "Downloading Packages"}
{"state": "running", "steps": -1, "event": "Check Package Signatures"}
{"state": "running", "steps": -1, "event": "Running Test Transaction"}
{"state": "running", "steps": -1, "event": "Running Transaction"}
{"state": "running", "steps": -1, "event": "Installing nethserver-lang-en-1.2.16-1.ns7.noarch"}
...
{"state": "running", "steps": -1, "event": "Removing nethserver-lang-en"}
{"status": "success", "steps": -1, "event": "Transaction end"}
{"state":"success"}+ exit 0
```

#### install

Same output as `update`.

#### remove

Same output as `update`.

#### set-config

Output event in json format.

Example:
```
{"steps":2,"pid":24484,"args":"","event":"software-repos-save"}
{"step":1,"pid":24484,"action":"S05generic_template_expand","event":"software-repos-save","state":"running"}
{"progress":"0.50","time":"0.242998","exit":0,"event":"software-repos-save","state":"done","step":1,"pid":24484,"action":"S05generic_template_expand"}
{"step":2,"pid":24484,"action":"S20nethserver-base-software-repos","event":"software-repos-save","state":"running"}
{"progress":"1.00","time":"0.422607","exit":0,"event":"software-repos-save","state":"done","step":2,"pid":24484,"action":"S20nethserver-base-software-repos"}
{"pid":24484,"status":"success","event":"software-repos-save"}
{"state":"success"}
```
