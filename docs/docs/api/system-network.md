# system-network

Manage network configuration.

## read

### Input

It takes a mandatory `action` argument.

Valid actions are:

- `list`
- `heirs`
- `available`
- `bond-types`

#### list

It takes only the `action` argument.

Example:
```json
{
  "action": "list"
}
```

#### heirs

It takes `action` and `parent` arguments.
The `parent` contains the name of the interface which will be deleted.

Example:
```json
{
  "action": "heirs",
  "parent": "br0"
}
```

#### bond-types

List the avaialbe bond types.

Example:
```json
[
  {
    "value": 3,
    "name": "broadcast"
  },
  {
    "value": 6,
    "name": "balance-alb"
  },
  {
    "value": 5,
    "name": "balance-tlb"
  },
  {
    "value": 1,
    "name": "active-backup"
  },
  {
    "value": 0,
    "name": "balance-rr"
  },
  {
    "value": 4,
    "name": "802.3ad"
  },
  {
    "value": 2,
    "name": "balance-xor"
  }
]
```

#### available

List all interfaces without a role.

Example:
```json
{
  "action": "available"
}
```

### Output

#### list

Inside the `configuration` field return a list of all network interfaces.

Example:
```json
{
  "status": null,
  "configuration": {
    "green": [
      {
        "bootproto": "none",
        "gateway": "192.168.5.253",
        "name": "br0",
        "devices": [
          {
            "link": "1",
            "bootproto": "none",
            "bus": "pci",
            "existing": 1,
            "model": "Intel Corporation 82540EM Gigabit Ethernet Controller (rev 02)",
            "name": "enp0s3",
            "bridge": "br0",
            "virtual": 0,
            "speed": "1000",
            "type": "ethernet",
            "mac": "08:00:27:8e:01:18",
            "role": "bridged",
            "driver": "e1000"
          }
        ],
        "virtual": 1,
        "aliases": [],
        "type": "bridge",
        "netmask": "255.255.255.0",
        "role": "green",
        "ipaddr": "192.168.5.246"
      }
    ],
    "free": [],
    "blue": [
      {
        "bus": "pci",
        "gateway": "",
        "model": "Intel Corporation 82540EM Gigabit Ethernet Controller (rev 02)",
        "speed": "1000",
        "netmask": "255.255.255.0",
        "mac": "08:00:27:bd:3d:37",
        "ipaddr": "10.10.10.2",
        "link": "1",
        "bootproto": "none",
        "existing": 1,
        "name": "enp0s8",
        "devices": [],
        "virtual": 0,
        "aliases": [
          {
            "name": "enp0s8:1",
            "netmask": "255.255.255.0",
            "type": "alias",
            "role": "alias",
            "virtual": 1,
            "ipaddr": "11.11.11.2"
          }
        ],
        "type": "ethernet",
        "role": "blue",
        "driver": "e1000"
      }
    ],
    "other": [],
    "orange": [],
    "red": [],
    "pppoe": 0
  }
}
```

Special fields:

- `devices`: if the interface is a bridge or a bond, contains the list of connected devices
- `aliases`: contains the list of alias devices
- `existing`: set to 1 if the device is physical and it's attacched to the system, 0 otherwise
- `virtual`: set to 1 if the device is a virtual network interface like bridge, bond, etc
- `pppoe`: set to 1 if there is a pppoe already configured, 0 otherwise

#### heirs

List of interfaces suitable for getting a new role.

Example:
```json
[
  "enp0s3",
  "enp0s4"
]
```

#### available

List of interfaces wihout a role.

Example:
```json
[
  "enp0s8",
  "enp0s9"
]
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `create-alias`
- `create-bridge`
- `create-bond`
- `create-vlan`
- `release-role`

Constraints for `create-alias`

- ipaddr: must be a valid IPv5 address
- netmask: must be a valid IPv4 network mask
- parent: must be the name of an existing network interface

Constraints for `create-bridge`

- devices: a list of non-configured interface names
- role: can be empty or `green`, `red`, `blue`, `orange`
- bootproto: must be `none` for blue and orange roles, can be also `dhcp` for
  green and red roles
- ipaddr: if bootproto is static, must be a free IPv4 address (also checked agains nsdc IP)
- netmask: if bootproto is static, must be an IPv4 netmask
- gateway: if bootproto is static, can be empty or an IPv4 address

Constraints for `create-bond`

- mode: can be a value between 0 and 6
- devices: a list of non-configured interface names
- role: can be empty or `green`, `red`, `blue`, `orange`
- bootproto: must be `none` for blue and orange roles, can be also `dhcp` for
  green and red roles
- ipaddr: if bootproto is static, must be a free IPv4 address (also checked agains nsdc IP)
- netmask: if bootproto is static, must be an IPv4 netmask
- gateway: if bootproto is static, can be empty or an IPv4 address

Constraints for `create-vlan`:

- tag: a positive integer
- parent: the name of an existing network interface, can't be another vlan
- role: can be empty or `green`, `red`, `blue`, `orange`
- bootproto: must be `none` for blue and orange roles, can be also `dhcp` for
  green and red roles
- ipaddr: if bootproto is static, must be a free IPv4 address (also checked agains nsdc IP)
- netmask: if bootproto is static, must be an IPv4 netmask
- gateway: if bootproto is static, can be empty or an IPv4 address

Constraints for `release-role`

- interface: must be the name of an existing network interface
- the role can't be released if it is the last green interface

### Input

#### create-alias

Example:
```json
{
  "action": "create-alias",
  "ipaddr": "192.168.1.246",
  "netmask": "255.255.255.0",
  "parent": "br0"
}
```

#### create-bridge

Example:
```json
{
  "action": "create-bridge",
  "role": "green",
  "bootproto": "none",
  "ipaddr": "192.168.1.246",
  "netmask": "255.255.255.0",
  "gateway": "192.168.1.1",
  "devices": [
    "enp0s9",
    "enp0s8"
  ]
}
```

#### create-bond

Example:
```json
{
  "action": "create-bond",
  "role": "green",
  "bootproto": "none",
  "ipaddr": "192.168.3.246",
  "netmask": "255.255.255.0",
  "mode": 0,
  "devices": [
    "enp0s9",
    "enp0s8"
  ]
}
```
#### create-vlan

Example:
```json
{
  "action": "create-vlan",
  "tag": 1,
  "role": "green",
  "bootproto": "none",
  "ipaddr": "192.168.2.246",
  "netmask": "255.255.255.0",
  "parent": "enp0s9"
}
```

#### release-role

Example:
```json
{
  "action": "release-role",
  "interface": "enp0s8"
}
```

## update

#### release-role

Use the same input from validate.

## create

### create-alias

Use the same input from validate.

### create-bridge

Use the same input from validate.

## delete

Delete the interface specified inside the `interface` field.
If `heir` field is set, copy all configuration from the bridge to `heir` interface.

Input example:
```json
{
  "heir": "enp0s8",
  "interface": "br1"
}
```

