# Guidelines

## API

Each API should always return a JavaScript promise in case of success or error.

Any functions which modifies system configuration must take care of semantic validation
of input values, like checking if a record already exists or deny to set an option which
can cause errors on other modules (eg. using the same IP address on multiple network interfaces).

Objects returned by APIs must reflect esmith db format and respect the upper/lower case notation
of property names.

#### Example

Host `goofy` inside the `hosts` database.

Original esmith db notation:
```
goofy=local
    Description=Goofy workstation
    IpAddress=192.168.1.22
    MacAddress=xx:xx:xx:xx:xx:xx
```

Equivalent JavaScript object notation:
```
var goofy = { 
  type: "local",
  Description: "Goofy workstation",
  IpAddress: "192.168.1.22",
  MacAddress: "xx:xx:xx:xx:xx:xx"
}
```


### CRUD

APIs implementing CRUD operations, should declare these actions:

- **add**: on success returns a success promise along with the created object, on error returns a failure promise along with a description of the error
- **edit**: on success returns a success promise along with the modified object, on error returns a failure promise along with a description of the error
- **delete**: on success returns a success promise along with an optional message, on error returns a failure promise along with a description of the error
- **getAll**: on success returns a success promise along with a list of all requested objects, on error returns a failure promise along with a description of the error
- **getOne**: on success returns a success promise along with the requested object, on error returns a failure promise along with a description of the error

## UI design

The whole web UI is designed following [PatternFly](http://www.patternfly.org/) patterns.
Please, read carefully PatternFly documentation before starting the design of a new web page.

All web page should guide the user to well-defined and specific task like:

- bad task example: "The user must choose the correct account provider"
- good task example: "The user must choose Active Directory provider if ACLs on shared folders are a functional requirements"

### Left menu

The left menu should be considered fixed: modules shouldn't add items inside the left menu.
When a module needs to add a new feature, the web page should be added inside exiting sections like "System".

### Applications

The Applications page is a container of each new module which implements new features, like mail server, nextcloud, etc.
Each new application web page should display:

- the status of the application status on the top
- a list of common actions just below the status
- all configuration parameters (forms, table, etc.) in the center

On first run, the application **must** display a wizard if the module can't be configured with a reasonable defaults.

Also the web page should display suggestions to help the user to follow best practices.
For example, inside the "Certificate page", the interface should display a suggestion to enable Let's Encrypt if 
a self-signed certificate is used as default.

### Forms

A configuration form should always display the minimum number of fields needed to configure the feature.
Extra parameters should be hidden inside an [Advanced](http://www.patternfly.org/pattern-library/forms-and-controls/expand-collapse-section/)
panel with reasonable defaults.

For example, when creating a user you need at least the user name, the full name and the password;
but you could hide extra details like street address or phone number.

Also it is a good practice to add a "Description" when creating records inside tables.

### Notifications

NethServer Cockpit provides 3 types of [toast notification](http://www.patternfly.org/pattern-library/communication/toast-notifications/):

- **success**: transient, it stays on the screen for 8 seconds
- **task**: transient, it stays on the screen until the task has been completed
- **error**: not transient, it stays on the screen until the user explicitly close it


## Accessibility

We need to evaluate how PatternFly copes with people suffering of low vision, who need to access most features
using the keyboard shortcuts.

## Code style

Please use configuration from EditorConfig: http://editorconfig.org

