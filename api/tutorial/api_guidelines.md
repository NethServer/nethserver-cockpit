# API guidelines

**Index**

* [Object format](#object-format)
* [Errors](#errors)
* [API design](#api-design)

### Object format

Objects returned by APIs must reflect esmith db format and respect the upper/lower case notation
of property names:

```
{
  key: 'objKey',
  type: 'objType',
  FirstProp: 'FirstPropValue',
  ...
}
```

Please note that **key** and **type** field are reserved.

### Example

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

### Errors

If something goes wrong, APIs should raise one of the following errors:

- Validation error: **NotValid**
  ```
  throw new Error("NotValid", "Descriptive validation error");
  ```

- Not found error: **NotFound**
  ```
  throw new Error("NotFound", "Descriptive not found error");


## API design

Each API should always return a JavaScript promise in case of success or error.

Any functions which modifies system configuration must take care of semantic validation
of input values, like checking if a record already exists or deny to set an option which
can cause errors on other modules (eg. using the same IP address on multiple network interfaces).

On success an API function returns a success promise, on error throws an error.
It's responsability of each API function to signal an event just after returning the promise.

APIs implementing CRUD operations, should declare these types of actions:

* [add](#add)
* [edit](#edit)
* [delete](#delete)
* [getAll](#get-all)
* [getOne](#get-one)


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

*Parameter*: key to be retrieved.

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

