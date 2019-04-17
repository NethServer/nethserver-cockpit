# proxy

Read and set gloval Squid configuration.

## read

The read API takes an `action` field.

Valid actions are:

- `configuration`
- `bypass-list`
- `object-list`

Input example:
```json
{
  "action": "configuration"
}
```

### Output

#### configuration

The `configuration` key contains the `squid` record from configuration db.

Output example:
```json
{
  "props": {
    "SafePorts": [],
    "status": "disabled",
    "PortBlock": "disabled",
    "ParentProxy": "",
    "GreenMode": "manual",
    "BlueMode": "manual",
    "PortRedirect": 8080
  },
  "name": "squid",
  "type": "service"
}
```

#### bypass-list

List all configured bypasses.

Output example:
```json
{
  "sources": [
    {
      "props": {
        "status": "enabled",
        "Host": {
          "type": "host",
          "name": "myhost"
        },
        "Description": ""
      },
      "name": "mybypass1",
      "type": "bypass-src"
    }
  ],
  "destinations": [
    {
      "props": {
        "status": "enabled",
        "Domains": [
          "test.nethesis.org"
        ],
        "Description": "Migrated from squid[BypassDomains]"
      },
      "name": "migrated-BypassDomains",
      "type": "bypass-dst"
    },
    {
      "props": {
        "status": "enabled",
        "Host": { 
          "type": "host",
          "name": "myhost2"
        },
        "Description": ""
      },
      "name": "mybypass2",
      "type": "bypass-dst"
    }
    ...
  ]
}
```

#### object-list

List all available objects to be used as source or destination.

Example:
```json
{
  "objects": [
    {
      "name": "a123",
      "IpAddress": "1.2.3.4",
      "type": "host",
      "Description": ""
    },
    {
      "Address": "10.10.10.0/24",
      "name": "cidr1",
      "type": "cidr",
      "Description": ""
    },
    ...
  ]
}
```

## validate

Valid actions are:

- `configuration`
- `create-bypass`
- `update-bypass`

### Constraints

Constraints for `configuration` action:

- status, PortBlock: can be `enabled` or `disabled`
- SafePorts: an empty array or an array of valid ports
- ParentProxy: an address in the format `host:port`, the `port` part is optional
- GreenMode, BlueMode: can be a value between `manual`,`authenticated`, `transparent`, `transparent_ssl`
- PortRedirect: empty or a valid port

Constraints for `update-bypass` and `create-bypass` actions:

### Input

#### configuration

Input example:
```json
{
  "SafePorts": [],
  "status": "enabled",
  "PortBlock": "disabled",
  "ParentProxy": "",
  "GreenMode": "transparent",
  "BlueMode": "manual",
  "action": "configuration"
}
```

#### update-bypass

Valid values for `type` field are:

- `bypass-dst` for destination bypass
- `bypass-src` for source bypass

Input example for destination bypass:
```json
{
  "action": "update-bypass",
  "Host": {
    "type": "host",
    "key": "a123"
  },
  "Description": "site 1 without proxy",
  "type": "bypass-dst",
  "name": "bypass1"
}
```

#### create-bypass

Valid values for `type` field are:

- `bypass-dst` for destination bypass
- `bypass-src` for source bypass

Input example for source bypass:
```json
{
  "action": "create-bypass",
  "Host": {
    "type": "host",
    "key": "a123"
  },
  "Description": "host without proxy",
  "type": "bypass-src"
}
```

Input example for destination bypass:
```json
{
  "action": "create-bypass",
  "Host": {
    "type": "host",
    "key": "a123"
  },
  "Description": "site 1 without proxy",
  "type": "bypass-dst"
}
```

Input example for domain based bypass:
```json
{
  "action": "create-bypass",
  "Domains": [
    "nethserver.org",
    "nethesis.it",
    ...
  ],
  "Description": "domains without proxy",
  "type": "bypass-dst"
}
```

## update

Same input from validate helper.

Extra valid actions:

- `enable-bypass`: enable given bypass
- `disable-bypass`: disable given bypass

Input example for enable action:
```json
{
  "action": "enable-bypass",
  "name": "t1"
}
```

Input example for disable action:
```json
{
  "action": "disable-bypass",
  "name": "t1"
}
```

## delete

Delete the given record.

Input example:
```json
{
  "name": "t1"
}
```

