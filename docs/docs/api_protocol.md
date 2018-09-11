# Communication protocol

The API and the UI talk to each other using JSON and the communication
protocol defines a set of a well-known objects.


## Esmith db records

Objects passed to and returned by APIs must reflect esmith db format and respect the upper/lower case notation
of property names:

```json
{
  "key": "objKey",
  "type": "objType",
  "props": {
      "FirstProp": "FirstPropValue",
      ...
  }
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

If something goes wrong, APIs must throw a [nethserver.Error](api#nethserver.Error)
object, which describes the error reason and possibly why the object passed to
the API function caused the error.

For instance:
```
throw new nethserver.Error({
    id: 1507721123244,
    type: 'NotValid',
    message: 'Generic validation error reason',
    attributes: {
        'MyProp1': 'field-specific error reason', 
        'MyProp2': 'other field-specific error reason'
    }
});
```

The **message** property should be used if an error is not caused by a specific
attribute. On the other hand, there could be cases where the **attributes**
object is empty, or undefined because the error condition does not depend on any
of the attributes or attributes are not defined at all. 

Note that the same Error object could represent multiple failure reasons.

How to generate a good `id` in JavaScript:
```
+ new Date()
```

An equivalent for Bash:
```text
$ date +%s
```

### Well-known errors

Well-known errors are:

- Validation error: **NotValid**
  ```
  throw new nethserver.Error({
      id: 1507721123244,
      type: 'NotValid',
      message: 'Generic validation error reason',
      attributes: {'myProp': 'field-specific error reason'}
  });
  ```

- Not found error: **NotFound**
  ```
  throw new nethserver.Error({
      id: 1507721155244,
      type: 'NotFound',
      message: 'Generic validation error reason',
      attributes: {'key': 'field-specific error reason'}
  });
  ```

- type ``ValidatorFailed``: validator procedure error - the ``validate`` command failed

