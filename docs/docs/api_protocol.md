# Communication protocol

The API and the UI talk to each other using JSON and the communication
protocol defines a set of a well-known objects.

As an exception, the [execute operation](/api_guidelines/#execute) can return RAW output instead of JSON.

## Esmith db records

Objects passed to and returned by APIs must reflect esmith db format and respect the upper/lower case notation
of property names:

```json
{
  "name": "keyname",
  "type": "typename",
  "props": {
      "FirstProp": "FirstPropValue",
      ...
  }
}
```

Please note that **name** and **type** field are reserved.

### Example

Host `goofy` inside the `hosts` database.

Original esmith db notation:
```
goofy=local
    Description=Goofy workstation
    IpAddress=192.168.1.22
```

Equivalent JSON notation:
```json
{
  "name": "goofy",
  "type": "local",
  "props": {
      "Description": "Goofy workstation",
      "IpAddress": "192.168.1.22"
  }
}
```

## Events

If invoked with `-j` option, the `signal-event` command outputs the event progress in JSON format.

Example:
```json
{"steps":2,"pid":17354,"args":"","event":"nethserver-lsm-save"}
{"step":1,"pid":17354,"action":"S05generic_template_expand","event":"nethserver-lsm-save","state":"running"}
{"progress":"0.50","time":"0.21036","exit":0,"event":"nethserver-lsm-save","state":"done","step":1,"pid":17354,"action":"S05generic_template_expand"}
{"step":2,"pid":17354,"action":"S90adjust-services","event":"nethserver-lsm-save","state":"running"}
{"progress":"1.00","time":"0.685865","exit":0,"event":"nethserver-lsm-save","state":"done","step":2,"pid":17354,"action":"S90adjust-services"}
{"pid":17354,"status":"success","event":"nethserver-lsm-save"}
```

Special fields:

- steps: set the total number of event actions 
- step: identify the current running step
- progress: percentage of event completion
- status: can be `success` or `failed` in case of failure

## Success

A successful response has no special requirements and is defined by the application 
needs.

For instance, a success message could be an empty object `{}` or as simple as:
```json
{
    "state": "success"
}
```

## Errors

If something goes wrong, APIs must output a JSON object which describes the error reason.

For instance:
```json
{
    "type": "Error",
    "message": "Generic error reason",
    "attributes": {
        "output": "output from the system"
    }
}
```

The **type** field is mandatory. Its value is a string identifying the error type. 
See the "Well-known errors" section below.

The **message** property should be used if an error is not caused by a specific
attribute. On the other hand, there could be cases where the **attributes**
object is empty, or undefined because the error condition does not depend on any
of the attributes or attributes are not defined at all. 

Note that the same Error object could represent multiple failure reasons.


### Well-known errors

The list of well-known errors includes:

- validation
- event failure
- invalid input


#### Validation

Validation error:

```json
{
  "type": "NotValid",
  "message": "Validation failed",
  "attributes": [
    {
      "parameter": "name",
      "value": "test4",
      "error": "valid_hostname_fqdn"
    }
  ]
}
```

#### Event failure

Event has failed:

```json
{
  "type": "EventFailed",
  "message": "See /var/log/messages"
} 
```

#### Invalid input

Invalid JSON object input:

```json
{
  "type": "InvalidInput",
  "message": "No JSON data available"
}
```

## Hints

Configuration suggestions displayed inside the UI.
An hint must always contain the following fields:

- `count`: the count of hints for the module, 0 means no hints
- `message`: if the hint is not bounded to a specific field, a general message for the module
- `link`: a link to external documentation
- `details`: contains hints specific to one ore more property. Object format: `<prop_name>`:`<message>`

Unused field should be set to `null`

Example of simple hint:
```json
{
  "count": 1,
  "details": null,
  "message": "must_configure_backup_data",
  "link": "http://docs.nethserver.org/en/v7/backup.html"
}
```

Example of multiple hint:
```json
{
  "count": 2,
  "details": {
    "snmpd": "service_not_consistent",
    "smartd": "service_not_consistent"
  },
  "message": null,
  "link": null
}
```
