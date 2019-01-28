# nat

Manage source nat and port forward.

## read

### Input

The read API requires an action field.
Valid actions:

- `snat`
- `portforward`
- `services`
- `wans`
- `protocols`

#### snat

Return the list of red aliases with associated forward host (if any).

Example:
```json
{
  "action": "snat"
}
```

#### portforward

Return the list of port forward.

Example:
```json
{
  "action": "portforward"
}
```

#### services

Return the list of services from `fwservices` db.

Example:
```json
{ 
  "action": "services"
}
```

#### wans

Return the list of red IPs.

Example:
```json
{ 
  "action": "wans"
}
```

#### protocols

Return the list of protocols from `/etc/protocols`.

Example:
```json
{ 
  "action": "protocols"
}
```


### Output

#### snat

Output example:
```json
{
  "aliases": [
    {
      "FwObjectNat": "host;myhost",
      "name": "ens8:0",
      "ipaddr": "1.2.3.4"
    },
    ...
  ]
}
```

#### portforward

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

#### services

Example:
```json
{
  "services": [
    {
      "Ports": [
        "67",
        "68"
      ],
      "name": "dhcp",
      "Protocol": "tcpudp",
      "type": "fwservice",
      "Description": ""
    },
    ...
  ]
}
```

#### wans

Example:
```json
{
  "wans": [
    "192.168.100.194",
    "10.0.0.212",
    "1.2.3.4"
  ]
}
```

#### protocols

Example:
```json
{
  "protocols": [
    "ip",
    "hopopt",
    "icmp",
    "igmp",
    ...
  ]
}
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `update-snat`

Constraints for `update-snat`:

- name: an existing alias 
- FwObjectNat: null, empty or valid host object

### Input

#### update-snat

Example:
```json
{
  "action": "update-snat",
  "FwObjectNat": "",
  "name": "ens8:0"
}
```


## update

Same input format from validate action.

## create

It uses the same format from input action.

## delete

