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

Example with `expand` set to `false`:
```json
{
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

- `create`
- `update`
- `delete`

Constraints for `create`:

Constraints for `update`:

Same as constraints as action `create` with addition filed `name`:

- name: a valid port forward name

Constraints for `delete`:

- name: a valid port forward name


### Input

Example:
```json
```

## update

Use the same input from validate.

## create

Use the same input from validate.

## delete

Use the same input from validate.

