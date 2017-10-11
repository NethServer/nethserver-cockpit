# Guidelines

**Index**

* [API design](#api-design)
  * [Object format](#object-format)
  * [Errors](#errors)
  * [add](#add)
  * [edit](#edit)
  * [delete](#delete)
  * [getAll](#get-all)
  * [getOne](#get-one)
* [UI design](#ui-design)
  * [Left menu](#left-menu)
  * [Applications](#applications)
  * [Forms](#forms)
  * [Notifications](#notifications)
* [Accessibility](#accessibility)
* [Code style](#code-style)

## API design

Each API should always return a JavaScript promise in case of success or error.

Any functions which modifies system configuration must take care of semantic validation
of input values, like checking if a record already exists or deny to set an option which
can cause errors on other modules (eg. using the same IP address on multiple network interfaces).

On success an API function returns a success promise, on error throws an error.
It's responsability of each API function to signal an event just after returning the promise.

### Object format

Objects returned by APIs must reflect esmith db format and respect the upper/lower case notation
of property names.

Host `goofy` inside the `hosts` database.

Original esmith db notation:
```
goofy=local
    Description=Goofy workstation
    IpAddress=192.168.1.22
```

Equivalent JavaScript object notation:
```
var goofy = {
  key: "goofy",
  type: "local",
  Description: "Goofy workstation",
  IpAddress: "192.168.1.22",
}
```

Please note that **key** and **type** field are reserved.

APIs implementing CRUD operations, should declare these types of actions:

* [add](#add)
* [edit](#edit)
* [delete](#delete)
* [getAll](#get-all)
* [getOne](#get-one)

### Errors

If something goes wrong, APIs should raise one of the following errors:

- Validation error: **NotValid**
  ```
  throw new Error("NotValid", "Descriptive validation error");
  ```

- Not found error: **NotFound**
  ```
  throw new Error("NotFound", "Descriptive not found error");
  ```

### Add

The API developer should provide one typed `add` method for each record type managed by the module.

*Parameter*: object to be addedd

#### Example

DNS module, which saves records inside the ``hosts`` database, defines two methods: `addRemoteHost`,  `addAlias`.

```
addRemoteHost: function(host) {
  var db = nethserver.getDatabase('configuration');
  return db.open().then(function() {
      ...
      if ( //not validate ) {
          throw new Error("NotValid", "Describe validation error here");
      }
      ...
      db.setObject(obj)
      return db.save();
  }).then(function(){
      nethserver.signalEvent('event', argument);
  });
}
```

### Edit

The API developer should provide one typed `edit` method for each record type managed by the module.

*Parameter*: object to be modified

#### Example

DNS module, which saves records inside the ``hosts`` database; define two methods named `editRemoteHost` and `editAlias`.

```
editRemoteHost: function(host) {
  var db = nethserver.getDatabase('hosts');
  return db.open().then(function() {
      ...
      if ( //object not found ) {
          throw new Error("not found", "Describe not found error here");
      }
      ...
      db.setObject(obj)
      return db.save();
  }).then(function(){
      nethserver.signalEvent('event', argument);
  });
}
```

### Delete

*Parameter*: key to be deleted

#### Example

DNS module, which saves records inside the ``hosts`, can define one or more methods. 

```
deleteRemoteHost: function(hostKey) {
  var db = nethserver.getDatabase('hosts');
  return db.open().then(function() {
      ...
      if ( //object not found) {
        throw new Error("error", "Describe not found error here");
      }
      ...
      db.delete(hostKey);
      return db.save();
  }).then(function(){
       nethserver.signalEvent('host-delete', hostKey);
  });
};
```

### Get all

On success returns a success promise along with a list of all requested objects, on error throws an exception.

The API developer should provide one typed `getAll` method for each record type managed by the module.

#### Example

DNS module, which saves records inside the ``hosts`, defines two typed methods: `getAllRemoteHosts`, `getAllAliases`.

```
getAllRemoteHost: function() {
    var ret = [];
    var db = nethserver.getDatabase('hosts');
    return db.open().then(function() {
        var keys = db.keys();
        for (var k in keys) {
            var o = db.getObject(keys[k]);
            ...
            ret.push(o);
        }
        ...
        return ret;
    });
}
```

### Get one

On success returns a success promise along with the requested object, on error throws an exception.

*Parameter*: id to be retrieved.

#### Example

DNS module, which saves records inside the ``hosts`, can define one or methos: `getOne`.

```
getOne: function(hostKey) {
    var db = nethserver.getDatabase('hosts');
    return db.open().then(function() {
        return db.getObject(hostKey);
    });
}
```

## UI design

The whole web UI is designed following [PatternFly](http://www.patternfly.org/) patterns.
Please, read carefully PatternFly documentation before starting the design of a new web page.

The main goal is to have a consistent design and behavior across all modules.

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

On first run, the application **must** display a modal wizard if the module can't be configured with a reasonable defaults.

Also the web page should display suggestions to help the user to follow best practices.
For example, inside the "Certificate page", the interface should display a suggestion to enable Let's Encrypt if 
a self-signed certificate is used as default.

Each application must be described by a [JSON manifest](./application_manifest) inspired to AppData freedesktop.org format.

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

### Modals

Modal overlay should be provided any time the user needs to enter data on a form and press "Save" button to change system configuration.

See also [Modal Overlay](http://www.patternfly.org/pattern-library/forms-and-controls/modal-overlay/) for extra use cases.

## Accessibility

We need to evaluate how PatternFly copes with people suffering of low vision, who need to access most features
using the keyboard shortcuts.

## Code style

Please use configuration from EditorConfig: http://editorconfig.org

