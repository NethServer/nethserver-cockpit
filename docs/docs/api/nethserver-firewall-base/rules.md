# rules

Manage rules for traffic which traverse the firewall.

## read

### Input

The read API requires an action field.
Valid actions:

- `list`
- `roles`
- `policies`


Example:
```json
{
  "action": "roles"
}
```

#### list

The `list` action takes an extra parameter `expand`.
If `expand` is set to `true`, the api will try to expand all objects involved in the rules
returning information about IP address, zone, etc.

Example:
```json
{
  "action": "list",
  "expand": true
}
```

### Output


#### list

Return the list of firewall rules.

The `status` section contains the `count` of existing rules,
and the `next` position available for newly created rule.

Example with `expand` set to `true`:
```json
{
  "status": {
    "next": 12,
    "count": 5
  },
  "rules": [
    ...
    {
      "Log": "info",
      "Time": {
        "WeekDays": [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun"
        ],
        "TimeStart": "00:30",
        "TimeStop": "01:30",
        "name": "cond1",
        "type": "time",
        "Description": ""
      },
      "Position": 2,
      "status": "enabled",
      "Service": {
        "Ports": [
          "25",
          "110",
          "143",
          "465",
          "587",
          "993",
          "995"
        ],
        "name": "email-grp",
        "Protocol": "tcp",
        "type": "fwservice",
        "Description": ""
      },
      "Action": "accept",
      "Dst": {
        "name": "any",
        "type": "any"
      },
      "id": "36",
      "Src": {
        "zone": "red",
        "IpAddress": "192.168.5.11",
        "name": "andrea",
        "type": "host"
      },
      "type": "rule",
      "State": "new",
      "Description": "desc1"
    },
    ...
  ]
}
```

Example with `expand` set to `false`:
```json
{
  "rules": [
    ...
    {
      "Log": "info",
      "Time": {
        "name": "cond1",
        "type": "time"
      },
      "Position": 2,
      "status": "enabled",
      "Service": {
        "name": "email-grp",
        "type": "fwservice"
      },
      "Action": "accept",
      "Dst": {
        "name": "any",
        "type": "any"
      },
      "id": "36",
      "Src": {
        "name": "andrea",
        "type": "host"
      },
      "type": "rule",
      "State": "new",
      "Description": "desc1"
    },
    ...
  ]
}
```

If `Src` or `Dst` is a raw value, is presented in the following format.

The `object` field reppresents the correspective object which can be created
from the raw value.

Example:
```json
{
  ...
  "Src": {
        "name": "192.168.1.1",
        "type": "raw",
        "object": "host"
  },
  "Dst": {
        "name": "192.168.20.0/24",
        "type": "raw",
        "object": "cidr"
  },
  ...
}
```

#### roles

Return the list of valid roles to be used on rule creation/edit.

Example:
```json
{
  "roles": [
    "green",
    "red",
    "vpn",
    "ivpn"
  ]
}
```

#### policies

Return the list of builtin policies parsing `/etc/shorewall/policy`.

Example:
```json
{
  "policies": [
    {
      "Log": "none",
      "Position": 1,
      "Time": null,
      "status": "enabled",
      "Service": null,
      "Action": "accept",
      "Dst": {
        "name": "red",
        "type": "role"
      },
      "Src": {
        "name": "green",
        "type": "role"
      },
      "type": "policy",
      "id": 10001
    },
    ...
  ]
}
```


## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `create-rule`
- `update-rule`

Constraints for `create-rule` and `update-rule`:

- Action: must be one between 'accept', 'reject', 'drop'
- Src and Dst: a valid firewall object or an IP/CIDR if type is set to 'raw'
- Time: empty or a time object from fwtimes database
- Position: a positive integer
- Service: a service object from fwservices database or 'any'
- status: can be `enabled` or `disabled`
- Log: `none` or `info`. If value is `info`, all matched packets will be logged in `/var/log/firewall.log`. Default is `none`
- Description: optional description
- State: can be `all` or `new`. If set to `all` the rule will be applied to existing connections. Default is `new`
- id: must exists on update


### Input

#### create-rule

Example with Src using a firewall object:
```json
{
  "Log": "none",
  "Time": null,
  "Position": 4,
  "status": "enabledd",
  "Service": {
    "name": "any",
    "type": "fwservice"
  },
  "Action": "reject",
  "Dst": {
    "name": "red",
    "type": "role"
  },
  "Src": {
    "name": "myhost",
    "type": "host"
  },
  "type": "rule",
  "State": "new",
  "action": "create-rule"
}
```


Example with Src using a raw value:
```json
{
  "Log": "none",
  "Time": null,
  "Position": 4,
  "status": "enabledd",
  "Service": {
    "name": "any",
    "type": "fwservice"
  },
  "Action": "reject",
  "Dst": {
    "name": "red",
    "type": "role"
  },
  "Src": {
    "name": "192.168.1.1",
    "type": "raw"
  },
  "type": "rule",
  "State": "new",
  "action": "create-rule"
}
```

#### update-rule

Example with Src using a firewall object:
```json
{
  "Log": "none",
  "Time": null,
  "Position": 4,
  "status": "enabledd",
  "Service": {
    "name": "any",
    "type": "fwservice"
  },
  "Action": "reject",
  "Dst": {
    "name": "red",
    "type": "role"
  },
  "Src": {
    "name": "myhost",
    "type": "host"
  },
  "type": "rule",
  "State": "all",
  "id" : 10,
  "action": "create-rule"
}
```


## update

Use the same input from validate, supports also the `reorder` action.

### reorder

The `rules` field contains an ordered list of rules id.
The API will update all `Position` properties accordingly to given order.

Input example:
```json
{
  "action": "reorder",
  "rules": [24,55,2]
}
```

## create

Use the same input from validate.

## delete

Example:
```json
{
    "name": "123"
}
```

