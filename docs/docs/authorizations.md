# Authorizations

Cockpit allows the login of any system users with a valid shell, that is the user shell must listed inside `/etc/shells` file.

The web interface can be profiled using two different methods:

- the left most menu containing the main sections like "System" and "Applications" is part of the Cockpit project,
   and can be customized following the [upstream documentation](https://cockpit-project.org/guide/149/packages.html)
- the inner menu inside "System" or "Applications" can be customized using nethserver-cockpit [roles](#roles).

## UI sections

The UI is split into 2 main sections:

- `System`: contains all modules shipped with nethserver-cockpit and available on any installation.
  Modules inside the system section can be used to configure the server basic behavior which is common to all modules.
  Some examples of system modules can be: the hostname, DNS configuration, account providers and so on.
  System modules are statically defined inside the `/etc/nethserver/cockpit/authorization/system-routes.json` and should
  not be modified 

- `Applications`: contains all modules shipped with extra RPM packages.
  Each application is a complete set of features.
  Some exampled os applications can be: the firewall module, nextcloud or the mail server.

A user can be granted access to specific applications or system modules.

## Roles

A role is composed by 2 parts:

- web routes: a list of modules accessible by the logged user
- APIs: a list of underlay scripts executable by the logged user using `sudo`

### Web routes

Each role must be defined inside `/etc/nethserver/cockpit/authorization/roles.json`.

A role is defined by:

- a name, a unique identifier for the role; a groups with the same name must
  exists inside the system
- an array of system modules inside the `system` key
- an array of applications inside the `applications`

Only listed modules will be accessible by the user, except
"Dashboard" and "About" modules which are accessible by all users.

Role example:
```json
{
    ...
    "managers":
    {
        "system": [
            "services",
            "users-groups"
        ],
        "applications": [
        ]
    }
    ...
}
```

### APIs

When accessing a web page, the interface calls some system APIs to display and edit data inside pages.
To grant a role to a user, create a system group named like the role itself.
Then grant to the group the ability to execute APIs calls using `sudo` configuration.

Please note also that each page could call multiple APIs.


### Default roles

The `root` user can always read and write everything, it can't be overridden.

Pre-defined roles are:

- `admins`: same privileges as root, it can be customized
- `managers`: access only user ad groups, services and disk-usage, it can be customized

To activate a role, create a group named like the role itself using the web interface
or `groupadd` command, then add one or more user to it.

### Creating new roles

Follow these steps to create a new role.

Add a new object inside the `roles.json` file. Example:

```json
...
"auditors":
{
   "system": [ "ssh" ],
   "applications": [ "nethserver-cgp" ]
}
...
```

Create a new group. Using the account provider:

```
echo '{"action":"group-create","name":"auditors1"}' | /usr/libexec/nethserver/api/system-users/create
```

Configure sudo.

Example, `visudo -f /etc/sudoers.d/30_cockpit_auditors:
```text
Cmnd_Alias MANAGER = /usr/libexec/nethserver/api/system-ssh/*

%auditors ALL=NOPASSWD: MANAGER

# server-manager does not require a tty
Defaults:%managers !requiretty
```
