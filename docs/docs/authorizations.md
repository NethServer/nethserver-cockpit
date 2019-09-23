# Authorizations

## Architecture

Cockpit allows the login of any system users with a valid shell, that is the user shell must listed inside `/etc/shells` file.

The web user interface (UI) can be profiled using two different methods:

- the left most menu containing the main sections like "System" and "Applications" is part of the Cockpit project,
   and can be customized following the [upstream documentation](https://cockpit-project.org/guide/149/packages.html)

- the inner menu inside "System" or "Applications" can be customized as documented here

### UI sections

The UI is split into 2 main sections:

- `System`: contains all modules shipped with nethserver-cockpit and available on any installation.
  Modules inside the system section can be used to configure the server basic behavior which is common to all modules.
  Some examples of system modules can be: the hostname, DNS configuration, account providers and so on.
  System modules are statically defined inside the `system-authorization/read` API and should
  not be modified.

- `Applications`: contains all modules shipped with extra RPM packages.
  Each application is a complete set of features.
  Some examples of applications can be: the firewall module, nextcloud or the mail server.

A group of users can be granted access to specific applications or system modules.

### API scripts

When accessing an application or a system module, the UI runs one or more
API scripts to display and edit data. API scripts often require root
privileges, so they are invoked with the `sudo` command.

It is possible to inspect the sudo configuration for any user by running as 
root a command like:

    sudo -ll -U john

If run without `-U` argument, `sudo` prints the configuration for the current
user.

API scripts are located under the `/usr/libexec/nethserver/api/` directory.

### Default authorizations

1.  The `root` user can read and write everything.

2.  The `admins` key in e-smith `configuration` DB defines the system admin
    **user** and admins **group**. By default they are respectively `admin` and
    `domain admins`. Designed admins are allowed to use any System module and any
    installed Application, provided that the correct sudoers configuration is
    shipped (read more about this later on this page).

3.  Only `root` is allowed to grant authorizations. Admins cannot grant or
    modify authorizations on System modules and Applications for themselves or other
    users.

### Delegation storage

The association of groups with applications and system modules describes who can
do what. It is stored in the `delegation` prop of the `cockpit.socket` key in
the `configuration` e-smith DB.

For instance the `delegation` prop value could be:

    [root@vm5 ~]# config getprop cockpit.socket delegation 
    g1:tls-policy:ssh:dns:nethserver-httpd,g2:nethserver-httpd

It states that

* the group `g1` has access to `tls-policy`, `ssh` and `dns` system modules. It is
  granted access also to the `nethserver-httpd` application.

* the group `g2` has access to the `nethserver-httpd` application.

The `delegation` property syntax is a comma-separated list of records. Each
record is a colon-separated list of fields, where the first field identifies a
group name, and the rest of the fields identify applications or system modules.

### sudoers configuration

The `delegation` prop value is translated to configuration for `sudo`, by expanding
the `/etc/sudoers.d/55_nsapi_perms` template. The contents of that file uses
other sudoers symbols (`Cmnd_Alias` commands lists), defined in `/etc/sudoers.d/50_nsapi`
and (by convention) `/etc/sudoers.d/50_nsapi_*` files.

Every time `delegation` changes or the sudoers configuration is altered (i.e. an
application is installed/removed), the event `delegation-save` must be signaled.

## How it works

The UI runs the API script `system-authorizations/read` to know what UI routes
(system modules and applications) are accessible to the currently logged in
user.

`system-authorizations/read` calls `sudo -ll` to see what commands the currently
logged in user can run. The listed script absolute paths are mapped to UI routes
  with the following rules:

- API dirs prefixed by `system-` define access to System modules. The API
  implementation obtains the UI route by discarding the prefix.  A few
  exceptions to this method exist and are handled by
  `system-authorizations/read` itself.

- Access to System modules is granted if the current user can run at least one
  `update` script under a given `system-` prefixed directory.

- Directories that have a prefix different from `system` are considered
  application routes. Access to Applications is granted if the current user can
  run at least one script under a given application directory.

## Authorizations vs applications

If an application does not ship a correct authorizations configuration only the
`root` user can run it. Admins and delegated groups typically cannot see it in
the UI menu, or hit against errors and weird behaviors.

### Development hints

The golden rule to observe during application development is:

> check the access for the `admin` user!

That means doing the following things:

1. run `sudo -ll -U admin`, and verify that any API script required by the application is listed

2. log in as `admin` and verify that the things still work

3. check also for unauthorized access: the output from `sudo -ll -U notadmin`
   **must not list** the application API scripts. After logging in, a non-admin 
   user **must not see** the application in the UI

Validate the sudoers configuration with the following command:

    # visudo -c
    /etc/sudoers: parsed OK
    ...
    /etc/sudoers.d/50_nsapi: parsed OK
    /etc/sudoers.d/50_nsapi_nethserver_samba: parsed OK
    /etc/sudoers.d/55_nsapi_perms: parsed OK


### Authorization implementation

The application RPM must ship a correct sudoers configuration file. For instance
the  `nethserver-samba` RPM/application has the following file for sudoers:

    /etc/sudoers.d/50_nsapi_nethserver_samba

Note that:

- The file must be owned by `root.root` and permissions must be `0440`
  (ensure the RPM `.spec` file also knows it)

- The path prefix is `/etc/sudoers.d/`, required by sudoers configuration

- The file name prefix is `50_nsapi_`, required by our naming conventions to
  group together similar files

- The file name contains the RPM and the application name, required by our naming conventions

- The `-` (minus) sign in the rest of the file name has been replaced by '_' (underscore)

The sudoers configuration file content declares a `Cmnd_Alias`, that is a named
list of commands. 

The list name is important and **must match** the application name (the same used
in `manifest.json`).

    Cmnd_Alias NSAPI_NETHSERVER_SAMBA = ...

The list naming rules are:

1. `NSAPI_` prefix

2. Write the application name in capital letters

3. Replace `-` (minus) with `_` (underscore)

The commands are listed using `,` (comma) as separator. It is possible to break
a line with `\`. Refer to `man sudoers` for the complete syntax. To get an
initial command list for your application run this command:

    find /usr/libexec/nethserver/api/nethserver-samba -type f -executable -printf '    %p, \\\n'

Another important declaration stated by the sudoers configuration file is:

    Defaults!NSAPI_NETHSERVER_SAMBA !requiretty

This allows the UI to spawn the API scripts without TTY allocation.