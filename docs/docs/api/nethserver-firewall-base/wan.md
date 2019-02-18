# wan

Manage WAN configuration and providers.

## read

### Input

The read API requires an action field.
Valid actions:

- `providers`
- `speedtest`
- `stats`
- `rules`

#### providers

Return the status of configured provider and the list of all red interfaces.

Example:
```json
{
  "action": "providers"
}
```

#### speedtest

Execute the speed test on the given interface.

Example:
```json
{
  "action": "speedtest",
  "interface" : "eth0"
}
```

#### stats

Retrieve current in/out bytes from netdata for each red interface.

Example:
```json
{
  "action": "stats"
}
```

#### rules

List the divert rules.

The `rules` action takes an extra parameter `expand`.
If `expand` is set to `true`, the api will try to expand all objects involved in the rules
returning information about IP address, zone, etc.

Example:
```json
{
  "action": "rules",
  "expand": true
}
```

### Output

#### providers

Output example:
```json
{
  "status": {
    "p1": 0
  },
  "configuration": {
    "interfaces": [
      {
        "provider": {
          "weight": "1",
          "name": "p1"
        },
        "FwOutBandwidth": "100",
        "gateway": "192.168.100.0/24",
        "nslabel": "",
        "FwInBandwidth": "100",
        "name": "ens7",
        "cidr": "192.168.100.194/24",
        "ipaddr": "192.168.100.194"
      }
    ],
    "multiwan": {
      "MaxPercentPacketLoss": "50",
      "MaxNumberPacketLoss": "10",
      "WanMode": "balance",
      "PingInterval": "5",
      "NotifyWan": "disabled",
      "CheckIP": [
        "8.8.8.8",
        "208.67.222.222"
      ]
    }
  }
}
```

#### speedtest

Output example:
```json
{
  "download": 54495.27977880809,
  "timestamp": "2019-01-16T11:09:53.701032",
  "ping": 6.512,
  "upload": 251214.38804888245,
  "server": {
    "latency": 6.512,
    "name": "Ancona",
    "url": "http://speedtest.fastnet.it/speedtest/upload.php",
    "country": "Italy",
    "lon": "13.5167",
    "cc": "IT",
    "host": "speedtest.fastnet.it:8080",
    "sponsor": "FASTnet S.p.A.",
    "url2": "http://195.96.192.202/speedtest/upload.php",
    "lat": "43.6169",
    "id": "1324",
    "d": 58.140628357117215
  }
}
```

#### stats

If data for red interfaces is not available (e.g. netdata is not running):

```json
{
  "ens7": null,
  "ens8": null
}
```

Example of good output:
```json
{
  "ens7": {
    "out": "1.4245688",
    "in": "0.7122844"
  },
  "ens8": {
    "out": "1.4245779",
    "in": "0.6062033"
  }
}
```

#### rules

Example with `expand` set to `true`:
```json
{
  "rules": [
    {
      "Log": "none",
      "Time": null,
      "Position": 256,
      "status": "enabled",
      "Service": {
        "name": "any",
        "type": "fwservice"
      },
      "Action": "provider;red2",
      "Dst": {
        "zone": "red",
        "name": "red",
        "type": "role",
        "Interfaces": [
          "ens7",
          "ens8"
        ]
      },
      "id": "42",
      "type": "rule",
      "Src": {
        "zone": "green",
        "IpAddress": "192.168.5.8",
        "name": "davidem",
        "type": "host"
      }
    }
    ...
  ]
}
```

Example with `expand` set to `false`:
```json
{
  "rules": [
    {
      "Log": "none",
      "Time": null,
      "Position": 256,
      "status": "enabled",
      "Service": {
        "name": "any",
        "type": "fwservice"
      },
      "Action": "provider;red2",
      "Dst": {
        "name": "red",
        "type": "role"
      },
      "id": "42",
      "type": "rule",
      "Src": {
        "name": "davidem",
        "type": "host"
      }
    }
    ...
  ]
}
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `provider`
- `wan`

Constraints for `provider`:

- FwOutBandwidth, FwInBandwidth: empty or a value greater than 0
- weight: value between 1 and 255
- name: the name of an existing network interface

Constraints for `wan`:

- WanMode: must be `balance` or `backup`
- CheckIP: comma-separated list of valid IP
- NotifyWan: can be `enabled` or `disabled`
- MaxNumberPacketLoss: a value between 2 and 99
- MaxPercentPacketLoss: a value between 0 and 100
- PingInterval: a value between 0 and 60


### Input

#### provider

Example:
```json
{
  "action": "provider",
  "FwOutBandwidth": 100,
  "FwInBandwidth": 30,
  "nslabel": "test",
  "weight": 25,
  "name": "ens7"
}
```

#### wan

Example:
```json
{
  "action": "wan",
  "WanMode": "balance",
  "CheckIP": ["8.8.8.8", "1.2.3.4"],
  "NotifyWan": "enabled",
  "MaxNumberPacketLoss": 3,
  "MaxPercentPacketLoss": 5,
  "PingInterval": 5
}

```

## update

Same input format from validate action.
