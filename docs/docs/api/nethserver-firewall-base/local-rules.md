# local-rules

Manage rules for traffic from/to the firewall itself

## read

### Input

The read API requires an action field.
Valid actions:

- `list`
- `roles`
- `policies`
- `services`


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

Return the list of traffic rules from/to the firewall.

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
    {
      "Log": "none",
      "Time": null,
      "Position": 1,
      "status": "enabled",
      "Service": {
        "name": "any",
        "type": "fwservice"
      },
      "Action": "accept",
      "Dst": {
        "name": "green",
        "type": "role"
      },
      "id": "40",
      "Src": {
        "name": "fw",
        "type": "fw"
      },
      "type": "rule"
    },
    ...
  ]
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

#### services

Return the list of services on the firewall using the the rule object format.

Example:
```json
{
  "services": [
    ...
    {
      "Log": "none",
      "Position": 5,
      "Time": null,
      "status": "enabled",
      "Service": {
        "Ports": "110,143,4190,993,995",
        "name": "dovecot",
        "Protocol": "tcp",
        "type": "service"
      },
      "Action": "accept",
      "Dst": {
        "zone": "fw",
        "name": "fw",
        "type": "role"
      },
      "Src": {
        "zone": "green",
        "name": "green",
        "type": "role"
      },
      "type": "service",
      "id": 5
    },
    ...
  ]
```


## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `create-rule`
- `update-rule`

Constraints for `create-rule` and `update-rule`:

- All constraints from [firewall rules](/api/nethserver-firewall-base/rules.md#validate)
- Src or Dst must be `fw`
- If Dst is `fw`, `Service` must be a `service` object type from `configuration` db


### Input

#### create-rule

Example:
```json
{
  "action": "create-rule",
  "Log": "none",
  "Time": null,
  "Position": 4,
  "status": "enabled",
  "Service": {
    "Ports": [
      "53",
      "67",
      "69",
      "53"
    ],
    "name": "dnsmasq",
    "Protocol": "tcpudp",
    "type": "service",
    "Description": ""
  },
  "Action": "accept",
  "Dst": {
    "name": "fw",
    "type": "fw"
  },
  "id": null,
  "Src": {
    "Address": "11.11.11.0/24",
    "name": "cidr2",
    "Description": "",
    "type": "cidr"
  },
  "type": "rule",
  "Description": ""
}
```

#### update-rule

Example:
```json
{
  "action": "update-rule",
  "Log": "none",
  "Time": null,
  "Position": 4,
  "status": "enabled",
  "Service": {
    "Ports": [
      "53",
      "67",
      "69",
      "53"
    ],
    "name": "dnsmasq",
    "Protocol": "tcpudp",
    "type": "service",
    "Description": ""
  },
  "Action": "accept",
  "Dst": {
    "name": "fw",
    "type": "fw"
  },
  "id": 44,
  "Src": {
    "Address": "11.11.11.0/24",
    "name": "cidr2",
    "Description": "",
    "type": "cidr"
  },
  "type": "rule",
  "Description": ""
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

