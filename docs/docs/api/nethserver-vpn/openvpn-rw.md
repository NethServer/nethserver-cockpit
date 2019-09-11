# openvpn-rw

Manage OpenVPN roadwarrior server.

## read

The read API takes an `action` field.

Valid actions are:

- `users`: list system users
- `interfaces`: list bridged interfaces
- `configuration`: RW server configuration
- `algorithms`: list all available cryptographic algorithms
- `accounts`: list current VPN accounts
- `download`: download given configuration or certificates
- `mail`: send the configuration to the given mail address 
- `connectionHistory`: list data about all the connections an account has established so far

### Input

#### users

Input example:
```json
{
  "action": "users"
}
```

#### interfaces

Input example:
```json
{
  "action": "interfaces"
}
```

#### configuration

Input example:
```json
{
  "action": "configuration"
}
```

#### algorithms

Input example:
```json
{
  "action": "algorithms"
}
```

#### accounts

Input example:
```json
{
  "action": "accounts"
}
```

#### download

It takes 2 extra fields: `type` and `name`.

Valid types are:

- `ovpn`: download complete configuration file
- `pem`: download all certificates in one PEM file
- `pkcs12`: download all certificate in one P12 file

The `name` field contains the account name.

Input example:
```json
{
  "action": "download",
  "type": "ovpn",
  "name": "account1"
}
```

#### mail

It takes 2 extra fields: 

- `address`: the destination address
- `name`: contains the account name

Input example:
```json
{
  "action": "mail",
  "address": "test@mydomain.org",
  "name": "account1"
}
```

#### connectionHistory

It takes 2 extra fields: 

- `account`: the account name of interest
- `timeInterval`: time interval search; valid values are `today`, `last_week` and `last_month`

Input example:
```json
{
  "action": "connectionHistory",
  "account": "andreal",
  "timeInterval": "last_week"
}
```


### Output

#### users

Output example:
```json
{
  "users": [
    {
      "shortname": "admin",
      "gecos": "NethServer Enterprise Administrator",
      "name": "admin@local.neth.eu"
    },
    ...
  ]
}
```

#### interfaces

Output example:
```json
{
  "interfaces": [
    {
      "name": "br1",
      "ipaddress": "192.168.1.1"
    }
  ]
}
```

#### configuration

Output example:
```json
{
  "configuration": {
    "AccountProvider": true,
    "status": "enabled",
    "PushDomain": "",
    "PushExtraRoutes": "enabled",
    "PushDns": "",
    "Digest": "",
    "Netmask": "255.255.255.0",
    "Compression": "disabled",
    "Mode": "routed",
    "Cipher": "",
    "PushNbdd": "",
    "RouteToVPN": "enabled",
    "Remote": [],
    "Network": "11.10.11.0",
    "BridgeStartIP": "",
    "AuthMode": "certificate",
    "BridgeName": "br0",
    "Port": "1194",
    "CustomRoutes": [
      "12.13.19.0/24",
      "12.13.20.0/24"
    ],
    "TlsVersionMin": "",
    "UDPPort": "",
    "PushWins": "",
    "action": "configuration",
    "Protocol": "tcp",
    "ClientToClient": "enabled",
    "BridgeEndIP": ""
  }
}
```

#### algorithms 

Output example:
```json
{
  "algorithms": {
    "ciphers": [
      {
        "name": "AES-128-CBC",
        "description": "weak"
      },
      {
        "name": "AES-192-CFB8",
        "description": "strong"
      },
      ...
    ],
    "digests": [
      {
        "name": "MD5",
        "description": "weak"
      },
      {
        "name": "RSA-SHA256",
        "description": "strong"
      },
      ...
    ]
  }
}

```

#### accounts 

`lastConnected` field is represented in UNIX Epoch time.

Output example:
```json
{
  "accounts": [
    {
      "Expiration": "2029-05-26",
      "statistics": null,
      "status": "enabled",
      "VPNRemoteNetwork": "",
      "ShortName": "giacomo",
      "lastConnected": 1568186022,
      "name": "giacomo@local.neth.eu",
      "OpenVpnIp": "11.10.10.24",
      "VPNRemoteNetmask": "",
      "Mode": "system",
      "Host": "ovpngiacomo2",
      "CertificateStatus": "V"
    },
    {
      "Expiration": "2029-05-12",
      "statistics": {
        "since": "Fri Jun  7 21:09:04 2019",
        "bytes_received": "14994293",
        "real_address": "192.168.5.22:36858",
        "bytes_sent": "2481500",
        "virtual_address": "11.10.11.6"
      },
      "status": "enabled",
      "VPNRemoteNetwork": "12.13.14.0",
      "ShortName": "ra1",
      "lastConnected": 1568111138,
      "name": "ra1",
      "OpenVpnIp": "11.10.10.2",
      "VPNRemoteNetmask": "255.255.255.0",
      "Mode": "vpn",
      "Host": "ovpnra1",
      "CertificateStatus": "V"
    }
  ]
}
```

#### download 

The `data` field is encoded in base64 format.

Output example:
```json
{
  "filename": "account1.ovpn",
  "data": "IyMjIyMjIy..."
}
```

#### mail

Standard error/sucess output.

#### connectionHistory

`startTime` and `endTime` fields are represented in UNIX Epoch time. `duration` field is represented in seconds.

Output example:
```json
{
  "connectionHistory": [
    {
      "endTime": 1568041178,
      "bytesSent": 3775,
      "startTime": 1568041138,
      "duration": 40,
      "bytesReceived": 3439,
      "virtualIpAddress": "10.0.10.10",
      "remoteIpAddress": "192.168.5.216"
    },
    ...
    {
      "endTime": 1568101636,
      "bytesSent": 2443,
      "startTime": 1568101624,
      "duration": 12,
      "bytesReceived": 3646,
      "virtualIpAddress": "10.0.10.10",
      "remoteIpAddress": "192.168.5.216"
    }
  ]
}
```


## validate

Valid actions are:

- `create-account`
- `update-account`
- `configuration`

### Constraints

Constraints for `update` action:

- Protocol: can be `udp` or `tcp`
- ServerStatus, ClientToClient, RouteToVPN, PushExtraRoutes: can be `enabled` or `disabled`
- AuthMode: can be `password`, `certificate` or `password-certificate`
- Mode: can be `routed` or `bridged`
- Bridge: if mode is `bridged`, a bridge name of a red interface
- BridgeStartIP: if mode is `bridged`, the first IP of the range reserved for the roadwarrior
- BridgeEndIP: if mode is `bridged`, the last IP of the range reserved for the roadwarrior
- Port: a valid port number
- Network: a valid network not already used by any network interface
- Netmask: a valid netmask for the given network
- PushDns, PushWins, PushNbdd: empty or a valid IP address
- PushDomain: empty or a valid domain name
- Compression: can be `disabled`, `lzo` or `lz4`
- Remote: empty or a list of IPs or host names
- CustomRoutes: empty or a list of CIDR blocks

Constraints for `create-account` action:

- name: name of an non-existing tunnel
- VPNRemoteNetwork/VPNRemoteNetmask: if present, a valid combination of network and netmask
- OpenVpnIp: a valid IP in the range of the roadwarrior server

Constraints for `update-account` action:

- name: name of an existing tunnel
- for all other fields, see the `create-account` action


### Input

#### update

Input example:
```json
{
  "status": "enabled",
  "PushDomain": "",
  "PushExtraRoutes": "enabled",
  "PushDns": "",
  "PushWins": "",
  "Netmask": "255.255.255.0",
  "Compression": "disabled",
  "Mode": "routed",
  "Cipher": "",
  "Port": "1194",
  "PushNbdd": "",
  "RouteToVPN": "enabled",
  "Remote": [
    ""
  ],
  "Network": "11.10.12.0",
  "BridgeStartIP": "",
  "AuthMode": "certificate",
  "BridgeName": "br0",
  "TlsVersionMin": "",
  "ClientToClient": "enabled",
  "BridgeEndIP": "",
  "Protocol": "tcp",
  "CustomRoutes": [
    "12.13.19.0/24",
    "12.13.20.0/24"
  ],
  "action": "configuration"
}
```

#### create-account

Input example:
```json
{
  "action": "create-account",
  "type": "vpn",
  "name": "account1",
  "OpenVpnIp": "",
  "VPNRemoteNetmask": "",
  "VPNRemoteNetwork": ""
}
```

#### update-account

Input example:
```json
{
  "action": "update-account",
  "type": "vpn",
  "name": "account1",
  "OpenVpnIp": "10.10.10.22",
  "VPNRemoteNetmask": "",
  "VPNRemoteNetwork": ""
}
```


## update

Same input from validate helper.

Extra valid actions:

- `enable`: enable given account
- `disable`: disable given account
- `kill`: kill the given account

Input example for enable action:
```json
{
  "action": "enable",
  "name": "account1"
}
```

Input example for disable action:
```json
{
  "action": "disable",
  "name": "account1"
}
```

Input example for kill action:
```json
{
  "action": "kill",
  "name": "account1"
}
```


## delete

Delete the given account.

Input example:
```json
{
  "name": "t1"
}
```

