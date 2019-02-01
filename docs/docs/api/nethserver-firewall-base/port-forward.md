# port-forward

Manage port forward.

## read

### Input

The read API requires an action field.
Valid actions:

- `list`

Return the list of port forward.

Example:
```json
{
  "action": "list"
}
```

### Output

Return the list of port forward.

Example:
```json
{
  "portforward": {
    "192.168.1.129": {
      "info": {
        "type": "ip"
      },
      "rules": [
        {
          "Log": "none",
          "Proto": "tcp",
          "status": "enabled",
          "name": "3",
          "Service": "",
          "Allow": "",
          "DstHost": "192.168.1.129",
          "Dst": "",
          "type": "pf",
          "Src": "88",
          "Description": "",
          "OriDst": ""
        }
      ]
    },
    "host;myhost": {
      "info": {
        "IpAddress": "192.168.1.22",
        "type": "object",
        "Description": "this is my myhost"
      },
      "rules": [
        {
          "Proto": "tcp",
          "Log": "info",
          "status": "enabled",
          "name": "4",
          "Service": "",
          "Allow": "",
          "DstHost": "host;myhost",
          "Dst": "",
          "type": "pf",
          "Src": "456",
          "Description": "",
          "OriDst": ""
        },
        ...
    ]
   }
   ...
}
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `create`
- `update`
- `delete`

Constraints for `create`:

- Proto: `tcp`, `udp` or `tcp,udp`" 
- Src: a port number or a range in the form `xxxx:yyyy`
- Dst: a port number, if empty the value of Src is used
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

