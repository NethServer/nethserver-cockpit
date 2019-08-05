# bypass

Read and set bypass for suricata.

## read

The read API takes an `action` field.

Valid actions are:

- `bypass-list`
- `object-list`

#### bypass-list

List all configured bypasses.

Output example:
```json
{
  "sources": [
    {
      "props": {
        "status": "disabled",
        "Host": {
          "name": "edoardo",
          "type": "host"
        },
        "Description": "src bypass desc"
      },
      "name": "bypass-src1",
      "type": "bypass-src"
    },
    {
      "props": {
        "status": "enabled",
        "Host": {
          "name": "192.168.5.8",
          "type": "raw"
        },
        "Description": "src bypass desc 2"
      },
      "name": "bypass-src3",
      "type": "bypass-src"
    },
  ],
  "destinations": [
    {
      "props": {
        "status": "enabled",
        "Host": {
          "name": "giacomo",
          "type": "host"
        },
        "Description": "dst bypass desc"
      },
      "name": "bypass-dst1",
      "type": "bypass-dst"
    },
    {
      "props": {
        "status": "disabled",
        "Host": {
          "name": "192.168.5.9",
          "type": "raw"
        },
        "Description": "src bypass desc 2"
      },
      "name": "bypass-dst2",
      "type": "bypass-dst"
    }
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
      "name": "edoardo",
      "IpAddress": "192.168.5.199",
      "type": "host",
      "Description": "Host edoardo"
    },
    {
      "name": "giacomo",
      "IpAddress": "192.168.5.246",
      "type": "host",
      "Description": "Host giacomo"
    }
  ]
}

```

## validate

Valid actions are:

- `create-bypass`
- `update-bypass`

### Input

#### update-bypass

Valid values for `type` field are:

- `bypass-dst` for destination bypass
- `bypass-src` for source bypass

Input example for source bypass:
```json
{
  "action": "update-bypass",
  "Host": {
    "type": "host",
    "key": "a123"
  },
  "Description": "bypass 1 for ips",
  "type": "bypass-src",
  "name": "bypass1"
}
```

Input example for destination bypass:
```json
{
  "action": "update-bypass",
  "Host": {
    "type": "host",
    "key": "a123"
  },
  "Description": "bypass 1 for ips",
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
  "Description": "bypass 1 for ips",
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

