# openvpn-tunnel

Manage OpenVPN tunnels.

## read

The read API takes an `action` field.

Valid actions are:

- `tunnels`
- `algorithms`
- `server-defaults`
- `download`

### Input 

#### tunnels

Input example:
```json
{
  "action": "tunnels"
}
```

#### algorithms

Input example:
```json
{
  "action": "algorithms"
}
```

#### server-defaults

Input example:
```json
{
  "action": "server-defaults"
}
```

#### download

The `download` action requires a `type` field.

Valid types are:

- `configuration`
- `psk`
- `certificate`

Input example:
```json
{
  "action": "download",
  "type": "configuration",
  "name": "tun2"
}
```

### Output

#### tunnels

List all OpenVPN tunnels. The `running` field tells is the related systemd unit is running.

Output example:
```json
{
  "tunnels": [
    {
      "statistics": {
        "since": "1559931452",
        "virtual_address": "",
        "remote_server": "",
        "state": "reconnecting"
      },
      "LocalPeer": "11.11.11.2",
      "status": "enabled",
      "Topology": "p2p",
      "RemoteHost": "1.2.3.4",
      "Digest": "",
      "Compression": "disabled",
      "Cipher": "",
      "Mode": "routed",
      "RemotePort": "2244",
      "AuthMode": "psk",
      "RemotePeer": "11.11.11.1",
      "Psk": "#\r\n# 2048 bit OpenVPN static key\r\n#\r\n-----BEGIN OpenVPN Static key V1-----\r\nxxxxxxxx...xxx\r\n-----END OpenVPN Static key V1-----\n",
      "name": "client2",
      "running": true,
      "props": [],
      "RemoteNetworks": [
        "12.12.12.0/24"
      ],
      "type": "tunnel",
      "Protocol": "udp",
      "WanPriorities": ["ens8","ens7"],
      "LocalNetworks": []
    },
    {
      "statistics": null,
      "status": "enabled",
      "Topology": "subnet",
      "RemoteHost": "80.17.99.73",
      "Digest": "",
      "Compression": "disabled",
      "Mode": "routed",
      "Cipher": "",
      "RemotePort": "1234",
      "AuthMode": "certificate",
      "name": "ctun1",
      "running": true,
      "RemoteNetworks": [],
      "props": [],
      "Crt": "-----BEGIN PRIVATE KEY-----\nxxxxxxxxx....\n-----BEGIN CERTIFICATE-----\n......-----END CERTIFICATE-----\n",
      "type": "tunnel",
      "Protocol": "udp",
      "LocalNetworks": []
    },
    {
      "PublicAddresses": [
        "5.6.7.8"
      ],
      "Network": "10.243.23.0/24",
      "status": "enabled",
      "name": "tun1",
      "running": true,
      "Port": "1234",
      "TlsVersionMin": "",
      "Topology": "subnet",
      "Digest": "",
      "RemoteNetworks": [
        "10.10.10.0/24"
      ],
      "Compression": "disabled",
      "Protocol": "udp",
      "Cipher": "",
      "type": "openvpn-tunnel-server",
      "LocalNetworks": [
        "192.168.1.0/24"
      ]
    },
    {
      "LocalPeer": "10.37.151.1",
      "PublicAddresses": [
        "1.2.3.4"
      ],
      "status": "enabled",
      "Topology": "p2p",
      "Digest": "",
      "Compression": "disabled",
      "Cipher": "",
      "RemotePeer": "10.37.151.2",
      "name": "tun2",
      "Psk": "#\r\n# 2048 bit OpenVPN static key\r\n#\r\n-----BEGIN OpenVPN Static key V1-----\r\nxxxxxxxx...xxx\r\n-----END OpenVPN Static key V1-----\n",
      "running": true,
      "Port": "1247",
      "TlsVersionMin": "",
      "RemoteNetworks": [
        "11.12.11.0/24"
      ],
      "type": "openvpn-tunnel-server",
      "Protocol": "udp",
      "LocalNetworks": [
        "192.168.1.0/24"
      ]
    }
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

#### algorithms

List all available algorithms.

Example:
```json
{
  "algorithms": {
    "ciphers": [
      {
        "name": "AES-128-CBC",
        "description": "weak"
      },
      {
        "name": "AES-128-CFB",
        "description": "weak"
      },
      ...
    ],
     "digests": [
      {
        "name": "MD5",
        "description": "weak"
      },
      {
        "name": "RSA-MD5",
        "description": "weak"
      },
      ...
    ]
  }
}
```

### server-defaults

Calculate valid defaults for a new tunnel server.
`PublicAddresses` has a value only if there are red interfaces with a static IP address.

Output example:
```json
{
  "LocalPeer": "10.75.171.1",
  "PublicAddresses": ["1.2.3.4"],
  "Network": "10.75.171.0/24",
  "RemotePeer": "10.75.171.2",
  "Psk": "#\n# 2048 bit OpenVPN static key\n#\n-----BEGIN OpenVPN Static key V1-----\nxxxxxxxxxxx....xxxxx\n-----END OpenVPN Static key V1-----\n",
  "Port": 1247,
  "LocalNetworks": [
    "192.168.1.0/24"
  ]
}
```

#### download

The `data` field contains a JSON file encoded in base64.

Output example:
```
{
  "data": "eyJuYW1...........I6InBzayJ9",
  "filename": "tun2.json"
}
```

## validate

Valid actions are:

- `create-server`
- `create-client`
- `update-server`
- `update-client`
- `upload`

### Constraints

Common constraints:

...

Constraints for `create` action:

- name: name of an non-existing tunnel

Constraints for `update` action:

- name: name of an existing tunnel


### Input

#### create-server

Input example for topology subnet:
```json
{
  "PublicAddresses": [
    "1.2.3.4"
  ],
  "Topology": "subnet",
  "Digest": "",
  "Compression": "disabled",
  "Cipher": "",
  "Network": "10.243.23.0/24",
  "name": "tun1",
  "Port": "1234",
  "TlsVersionMin": "",
  "RemoteNetworks": [
    "10.10.10.0/24"
  ],
  "Protocol": "udp",
  "LocalNetworks": [
    "192.168.5.0/24"
  ],
  "action": "create"
}
```

Input example for topology p2p:
```json
{
  "PublicAddresses": [
    "1.2.3.4"
  ],
  "Topology": "p2p",
  "Digest": "",
  "Compression": "disabled",
  "Cipher": "",
  "name": "tun1",
  "Port": "1234",
  "TlsVersionMin": "",
  "RemoteNetworks": [
    "10.10.10.0/24"
  ],
  "Protocol": "udp",
  "LocalNetworks": [
    "192.168.5.0/24"
  ],
  "Psk": "xxxx",
  "LocalPeer": "10.10.10.1",
  "RemotePeer": "10.10.10.2",
  "action": "create"
}
```

#### create-client

Input example:
```json
```


#### update-server

Input example:
```json
```

#### update-client

Input example for p2p client:
```json
{
  "LocalPeer": "11.11.11.2",
  "status": "enabled",
  "Topology": "p2p",
  "RemoteHost": [
    "1.2.3.4"
  ],
  "Digest": "",
  "Compression": "disabled",
  "Cipher": "",
  "Mode": "routed",
  "RemotePort": "2244",
  "AuthMode": "psk",
  "RemotePeer": "11.11.11.1",
  "Psk": "testpsk",
  "name": "client2",
  "RemoteNetworks": [
    "12.12.12.0/24"
  ],
  "type": "tunnel",
  "Protocol": "udp",
  "WanPriorities": [
    "ens8",
    "ens7"
  ],
  "LocalNetworks": [],
  "action": "update-client"
}
```

Input example for subnet client:
```json
{
  "status": "enabled",
  "Topology": "subnet",
  "RemoteHost": [
   "1.2.3.4"
  ],
  "Digest": "",
  "Compression": "disabled",
  "Cipher": "",
  "Mode": "routed",
  "RemotePort": "1234",
  "AuthMode": "certificate",
  "name": "ctun1",
  "RemoteNetworks": [],
  "Crt": "-----BEGIN PRIVATE KEY-----...-----END CERTIFICATE-----\n",
  "type": "tunnel",
  "WanPriorities": [],
  "LocalNetworks": [],
  "User": "user1",
  "Password": "pass1"
}
```

#### upload

The `data` field contains a json object encoded with base64.

Input example:
```json
{
  "action": "upload",
  "data" "eyJuYW1lIjoi...I6InBzayJ"
}
```

## update

Valid actions are:

- `update-server`
- `update-client`
- `enable`: enable given tunnel
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

## create

Valid actions are:

- `create-server`
- `create-client`
- `upload`

## delete

Delete the given record.

Input example:
```json
{
  "name": "t1"
}
```

