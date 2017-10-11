# API guidelines

**Index**

* [Object format](#object-format)
* [Errors](#errors)
* [API design](#api-design)
* [API tests](#api-tests)

## Object format

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
```

## Errors

If something goes wrong, APIs should raise a specific error.

A `nethserver.Error` constructor takes an object with the following fields:

- **id**: an fixed integer (usually a timestamp) which can be used to find the code which generated the error
- **type**: a fixed string which describes the type of the error (required)
- **message**: a descriptive error message (required)
- **attribute**: the object field which caused the error (optional) 

How to generate a good `id` in JavaScript:
```
+ new Date()
```

An equivalent for Bash:
```
date +%s
```

### Well-known errors

Well-known errors are:

- Validation error: **NotValid**
  ```
  throw new nethserver.Error({
      id: 1507721123244,
      type: 'NotValid',
      message: 'Descriptive validation error',
      attribute: 'myProp'
  })
  ```

- Not found error: **NotFound**
  ```
  throw new nethserver.Error({
      id: 1507721155244,
      type: 'NotFound',
      message: 'Descriptive not found error',
      attribute: 'key'
  })
  ```

- Task already running error (the e-smith layer can't handle multiple running events): **TaskRun**
 ```
  throw new nethserver.Error({
      id: 1507721155255,
      type: 'TaskRun',
      message: 'Another task is already running'
  })
 ```

## API design

Each API should always return a JavaScript promise in case of success or error.

Any function which modifies system configuration must take care of semantic validation
of input values, like checking if a record already exists or deny to set an option which
can cause errors on other modules (eg. using the same IP address on multiple network interfaces).

On success an API function returns a promise which is resolved if validation is passed and the configuration
can be saved into the system. On error, the function must throw an error.
It's responsability of each API function to signal an event just after returning the promise.
The framework will take care to inform the user when the event task has been terminated.

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

## API tests

When implementing a new API, the developer should take care of writing tests.
Test should be placed undet the `api/test` directory.
Each test is composed by two files:

- a js file which runs the tests
- an html file which displays test results

Used test framework is [Mocha](https://mochajs.org/) which uses [Should.js](http://shouldjs.github.io/).

Test can be accessed using Cockpit interface: `https://<server>:9090/nethserver/test-<module_name>`

### Example

Given a module named `mymodule`, create two files:

- test-mymodule.js
- test-mymodule.html

Test will be accessibile at: `https://myserver.mydomain.org:9090/nethserver/test-mymodule`

Content of `test-mymodule.js`:
```
mocha.setup('bdd');

describe('nethserver.system namespace', function () {
    it('is defined', function() {
        should(typeof nethserver.system === 'object').be.ok();
    });
});

describe('MyModule testCall', function(done) {
   return nethserver.mymodule.testCall().then(function(val) {
       return val.should.be.equal("abcd"); 
   });
});


it('MyModule testCalls musth throw error', function() {
    nethserver.system.mymodule.testCall('wrong paramater').should.be.rejectedWith(Error);
});

mocha.checkLeaks();
mocha.globals(['jQuery', 'cockpit']);
mocha.run();
```

Content of `test-mymodule.html`:
```
<!doctype html>
<html>
    <head>
      <title>NethServer mymodule API test</title>
      <meta charset="utf-8">
      <link rel="stylesheet" href="mocha.css">
    </head>
    <body>
        <div id="mocha"></div>

        <script src="../base1/jquery.min.js"></script>
        <script src="../base1/cockpit.min.js"></script>
        <script src="core.js"></script>
        <script src="mymodule.js"></script> <!-- include the implementation of you module -->
        <script src="should.js"></script>
        <script src="mocha.js"></script>
        <script src="test-system.js"></script>
    </body>
</html>
```
