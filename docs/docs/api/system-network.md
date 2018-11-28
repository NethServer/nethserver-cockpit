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
- `vlan-available`
- `routing`

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
#### available

List all interfaces without a role.

Example:
```json
{
  "action": "available"
}
```

#### bond-types

List the available bond types.

Example:
```json
{
  "action": "bond-types"
} 
```

#### vlan-available

List all interfaces suitable for a vlan.

Example:
```json
{
  "action": "vlan-availables"
}
```


#### routing

List routing table (`route -n`)

Example:
```json
{
  "action": "routing"
}
```


### Output

#### list

Inside the `configuration` field return a list of all network interfaces.
The `status` field contain current network status; if a newtork interface is configured with DHCP, 
the current address is contained inside the `ipaddr` field.

Example:
```json
{
  "status": {
    "enp0s8": {
      "link": "1",
      "bus": "pci",
      "speed": "1000",
      "model": "Intel Corporation 82540EM Gigabit Ethernet Controller (rev 02)",
      "mac": "08:00:27:8e:01:18",
      "driver": "e1000"
    },
    "enp0s9": {
      "link": "1",
      "bus": "pci",
      "speed": "1000",
      "model": "Intel Corporation 82540EM Gigabit Ethernet Controller (rev 02)",
      "mac": "08:00:27:3d:b1:2b",
      "driver": "e1000"
    },
  },
  "configuration": {
    "green": [
      {
        "bootproto": "none",
        "gateway": "",
        "BondOptMode": "2",
        "name": "bond0",
        "devices": [
          {
            "link": "1",
            "bootproto": "none",
            "bus": "pci",
            "existing": 1,
            "master": "bond0",
            "model": "Intel Corporation 82540EM Gigabit Ethernet Controller (rev 02)",
            "name": "enp0s8",
            "virtual": 0,
            "speed": "1000",
            "type": "ethernet",
            "mac": "08:00:27:bd:3d:37",
            "role": "slave",
            "driver": "e1000"
          },
          {
            "link": "1",
            "bootproto": "none",
            "bus": "pci",
            "existing": 1,
            "master": "bond0",
            "model": "Advanced Micro Devices Inc. [AMD] 79c970 [PCnet32 LANCE] (rev 10)",
            "name": "enp0s9",
            "virtual": 0,
            "speed": "",
            "type": "ethernet",
            "mac": "08:00:27:36:f0:08",
            "role": "slave",
            "driver": "pcnet32"
          }
        ],
        "virtual": 1,
        "aliases": [],
        "type": "bond",
        "netmask": "255.255.255.0",
        "role": "green",
        "ipaddr": "192.168.4.246",
        "nslabel": "MyMightyGreen"
      },
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
        "ipaddr": "192.168.5.246",
        "cidr": "192.168.5.246/24"
      }
    ],
    "free": [],
    "blue": [
      {
        "parent": "enp0s8",
        "bootproto": "none",
        "gateway": "",
        "name": "enp0s8.2",
        "devices": [],
        "virtual": 1,
        "aliases": [],
        "type": "vlan",
        "netmask": "255.255.255.0",
        "tag": "2",
        "role": "blue",
        "ipaddr": "11.12.13.246"
      }
    ],
    "other": [],
    "pppoe": 0,
    "orange": [],
    "missing": [],
    "red": [
      {
        "provider": "xDSL provider",
        "AuthType": "auto",
        "FwOutBandwidth": "",
        "name": "ppp0",
        "FwInBandwidth": "",
        "devices": [
          {
            "link": "1",
            "bus": "pci",
            "existing": 1,
            "model": "Intel Corporation 82540EM Gigabit Ethernet Controller (rev 02)",
            "name": "enp0s8",
            "devices": [],
            "virtual": 0,
            "speed": "1000",
            "aliases": [],
            "type": "ethernet",
            "mac": "08:00:27:bd:3d:37",
            "role": "pppoe",
            "driver": "e1000"
          }
        ],
        "virtual": 1,
        "Password": "pass2",
        "aliases": [],
        "user": "user1",
        "type": "xdsl",
        "role": "red"
      }
    ]

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

#### bond-types

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

#### vlan-available

Example:
```json
[
  "bond0",
  "br0",
  "enp0s3",
  "enp0s8",
  "enp0s9"
]
```

#### routing

Example:
```json
{
  "data": "Kernel IP routing table\nDestination     Gateway         Genmask         Flags Metric Ref    Use Iface\n0.0.0.0         192.168.5.253   0.0.0.0         UG    0      0        0 br0\n169.254.0.0     0.0.0.0         255.255.0.0     U     1010   0        0 br0\n192.168.5.0     0.0.0.0         255.255.255.0   U     0      0        0 br0\n"
}
```


## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `create-alias`
- `create-bridge`
- `create-bond`
- `create-vlan`
- `set-pppoe`
- `release-role`
- `change-properties`

Constraints for `create-alias`

- ipaddr: must be a valid IPv5 address
- netmask: must be a valid IPv4 network mask
- parent: must be the name of an existing network interface

Constraints for `create-bridge`

- devices: a list of non-configured interface names
- role: can be empty or `green`, `red`, `blue`, `orange`
- bootproto: must be `none` for blue and orange roles, can be also `dhcp` for red role
- ipaddr: if bootproto is static, must be a free IPv4 address (also checked agains nsdc IP)
- netmask: if bootproto is static, must be an IPv4 netmask
- gateway: if bootproto is static, can be empty or an IPv4 address

Constraints for `create-bond`

- BondOptMode: can be a value between 0 and 6
- devices: a list of non-configured interface names
- role: can be empty or `green`, `red`, `blue`, `orange`
- bootproto: must be `none` for blue and orange roles, can be also `dhcp` for red role
- ipaddr: if bootproto is static, must be a free IPv4 address (also checked agains nsdc IP)
- netmask: if bootproto is static, must be an IPv4 netmask
- gateway: if bootproto is static, can be empty or an IPv4 address

Constraints for `create-vlan`

- tag: a positive integer
- parent: the name of an existing network interface, can't be another vlan
- role: can be empty or `green`, `red`, `blue`, `orange`
- bootproto: must be `none` for blue and orange roles, can be also `dhcp` for red role
- ipaddr: if bootproto is static, must be a free IPv4 address (also checked agains nsdc IP)
- netmask: if bootproto is static, must be an IPv4 netmask
- gateway: if bootproto is static, can be empty or an IPv4 address

Constraints for `set-pppoe`

- AuthType: can be `auto`, `pap` or `chap`
- parent: the name of an existing network interface

Constraints for `release-role`

- interface: must be the name of an existing network interface
- the role can't be released if it is the last green interface

Constraints for `release-device`

- interface: must be the name of an existing network enslaved or bonded interface

Constraints for `change-properties`

- interface: the name of an existing network interface
- role: can be empty or `green`, `red`, `blue`, `orange`
- bootproto: must be `none` for blue and orange roles, can be also `dhcp` for red role
- ipaddr: if bootproto is static, must be a free IPv4 address (also checked agains nsdc IP)
- netmask: if bootproto is static, must be an IPv4 netmask
- gateway: if bootproto is static, can be empty or an IPv4 address
- devices: if the interface is a bond or a bridge, a list of existing free interfaces


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
  "gateway": "192.168.1.1",
  "BondOptMode": 0,
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

#### set-pppoe


Example:
```json
{
  "action": "set-pppoe",
  "parent": "enp0s8",
  "AuthType": "auto",
  "Password": "mypass",
  "user": "myuser",
  "provider": "xDSL provider"
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

#### release-device

Example:
```json
{
  "action": "release-device",
  "interface": "enp0s9"
}
```

#### change-properties

The `devices` field is mandatory only for bridges and bonding.
The `BondOptMode` is mandatory only for bonding;

Example:
```json
{
  "action": "change-properties",
  "role": "blue",
  "bootproto": "none",
  "interface": "br1",
  "ipaddr": "192.168.1.246",
  "netmask": "255.255.255.0",
  'nslabel': "MyGuests"
  "BondOptMode": 0,
  "devices": [
    "enp0s9"
  ]
}
```


## update

#### release-role

Use the same input from validate.

#### release-device

Use the same input from validate.

#### change-properties

Use the same input from validate.

#### set-pppoe

Use the same input from validate.

#### unset-pppoe

Input example:
```json
{
  "action": "unset-pppoe"
}
```

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

