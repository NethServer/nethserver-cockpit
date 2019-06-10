# ipsec

Manage IPSec tunnels.

## read

The read API takes an `action` field.

Valid actions are:

- `tunnels`
- `interfaces`
- `subnets`
- `algorithms`

Input example:
```json
{
  "action": "tunnels"
}
```

### Output

#### tunnels

List all IPSec tunnels. The `statistics` field contains info about a running tunnel.

Output example:
```json
{
  "tunnels": [
    {
      "leftsubnets": [
        "10.10.10.0/24"
      ],
      "left": "ens33",
      "esp": "auto",
      "statistics": null,
      "status": "enabled",
      "pfs": true,
      "psk": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "rightid": "@rid",
      "name": "dev1",
      "leftid": "@lid",
      "dpdaction": "hold",
      "right": "any",
      "compress": false,
      "type": "ipsec-tunnel",
      "ike": "auto",
      "rightsubnets": [
        "192.168.1.0/24"
      ]
    },
    {
      "leftsubnets": [
        "10.11.11.0/24"
      ],
      "left": "ens34",
      "esp": "auto",
      "statistics": {
        "sent_bytes": "234",
        "received_bytes": "577567",
        "started": "1558014702",
        "type": "ESP"
      },
      "status": "enabled",
      "pfs": true,
      "psk": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "rightid": "@dev1r,
      "name": "randev",
      "leftid": "@dev1l",
      "dpdaction": "hold",
      "right": "1.2.3.4",
      "compress": false,
      "type": "ipsec-tunnel",
      "ike": "auto",
      "rightsubnets": [
        "192.168.3.0/24"
      ]
    },
    ...
  ]
}
```

#### interfaces

List all red interfaces.

Output example:
```json
{
  "interfaces": [
    {
      "name": "ens7",
      "address": "dhcp"
    },
    {
      "name": "ens8",
      "address": "1.2.3.4"
    }
  ]
}
```

#### subnets

List all local subnets.

Example:
```json
{
  "subnets": [
    "192.168.1.0/24",
    ...
  ]
}
```

#### algorithms

List all available algorithms.

Example:
```json
{
  "algorithms": {
    "ciphers": [
      {
        "name": "3des",
        "description": "3DES"
      },
      ...
    ],
    "pfsgroups": [
      {
        "name": "modp1024",
        "description": "1024 bit (DH-2)"
      },
      ...
    ],
    "hashes": [
      {
        "name": "md5",
        "description": "MD5"
      },
      ...
    ]
  }
}
```


## validate

Valid actions are:

- `create`
- `update`

### Constraints

Common constraints:

- left: an existing network interface
- right: an host address or %any
- leftid, rightid: a string, maximum lenght is 63 characters
- psk: a string longer than 6 characters
- ikecipher, ikehash, ikepfsgroup, espcipher, esphash, esppfsgroup: see `man ipsec.conf` 
- ike, esp: a value between `auto` and `custom`
- ikelifetime, salifetime: positive integer
- leftsubnets, rightsubnets: an array of network in CIDR format
- status: can be `enabled` or `disabled`
- pfs, compression, dpdactions: a valute between `true` and `false`

Constraints for `create` action:

- name: name of an non-existing tunnel

Constraints for `update` action:

- name: name of an existing tunnel


### Input

#### create

Input example:
```json
{
  "leftsubnets": [
    "192.168.1.0/24"
  ],
  "left": "ens7",
  "esp": "custom",
  "ikelifetime": "4000",
  "esphash": "md5",
  "ikehash": "md5",
  "espcipher": "3des",
  "pfs": true,
  "psk": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "name": "dev1",
  "rightid": "@demosec",
  "esppfsgroup": "modp1024",
  "leftid": "@netheu",
  "salifetime": "5000",
  "dpdaction": "hold",
  "right": "1.2.3.4",
  "ikepfsgroup": "modp1024",
  "compress": false,
  "rightsubnets": [
    "10.78.79.0/24"
  ],
  "ikecipher": "3des",
  "ike": "custom",
  "action": "create"
}
```

#### update

Input example:
```json
{
  "leftsubnets": [
    "192.168.1.0/24"
  ],
  "left": "ens7",
  "esp": "custom",
  "ikelifetime": "4000",
  "esphash": "md5",
  "ikehash": "md5",
  "espcipher": "3des",
  "pfs": true,
  "psk": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "name": "dev1",
  "rightid": "@demosec",
  "esppfsgroup": "modp1024",
  "leftid": "@netheu",
  "salifetime": "5000",
  "dpdaction": "hold",
  "right": "1.2.3.4",
  "ikepfsgroup": "modp1024",
  "compress": false,
  "rightsubnets": [
    "10.78.79.0/24"
  ],
  "ikecipher": "3des",
  "ike": "custom",
  "action": "update"
}
```


## update

Same input from validate helper.

Extra valid actions:

- `enable`: enable given tunnell
- `disable`: disable given tunnel

Input example for enable action:
```json
{
  "action": "enable",
  "name": "tunnel1"
}
```

Input example for disable action:
```json
{
  "action": "disable",
  "name": "tunnel1"
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

