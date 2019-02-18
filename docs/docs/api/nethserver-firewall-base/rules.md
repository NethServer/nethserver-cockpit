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

Example with `expand` set to `true`:
```json
{
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
      "Description": "desc1"
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


## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `create`
- `update`
- `delete`

Constraints for `create`:

- Proto: `tcp`, `udp` or `tcpudp`, `ah`, `gre`, `ah`, `esp` 
- Src: a port number or a range in the form `xxxx:yyyy`, must be empty if protocol is not tcp, udp or tcpudp
- Dst: a port number, if empty the value of Src is used, must be empty if protocol is not tcp, udp or tcpudp
- DstHost: a destination host, can be an IP address or a host firewall object
- OriDst: an IP address or empty
- Allow: allowed ip address or network, see SOURCE  at <http://www.shorewall.net/4.2/manpages/shorewall-rules.html>
- status: can be `enabled` or `disabled`
- Description: optional description
- Log: `none` or `info`. If value is `info`, all matched packets will be logged in `/var/log/firewall.log`. Defaults to none

Constraints for `update`:

Same as constraints as action `create` with addition filed `name`:

- name: a valid port forward name

Constraints for `delete`:

- name: a valid port forward name


### Input

Example:
```json
{
  "action": "update",
  "Log": "none",
  "Proto": "tcp",
  "status": "enabled",
  "name": "3",
  "Service": "",
  "Allow": "",
  "DstHost": "192.168.5.129",
  "Dst": "",
  "type": "pf",
  "Src": "88",
  "Description": "",
  "OriDst": ""
}
```

## update

Use the same input from validate.

## create

Use the same input from validate.

## delete

Use the same input from validate.

