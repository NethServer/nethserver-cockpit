# dashboard

Read OpenVPN and IPSec status.

## read

The read API takes an `action` field.

Valid actions are:

- `status`: return configuration status
- `chart`: return chart for the given interface

### Input

#### status

Input example:
```json
{
  "action": "status"
}
```

#### chart

The API requires an extra `name` field which contain the interface name.

Input example:
```json
{
  "action": "chart",
  "name": "tunrw"
}
```

### Output

#### status

Return current IPSec tunnels and OpenVPN status.
`topTrafficAccounts` field specifies the accounts who generated more download/upload data. `traffic` field is represented in bytes.

Output example:
```json
{
  "openvpn": {
    "tunnels": {
      "interfaces": [
        "tunctun1",
        "tunctun2",
        "tuntun1",
        "tuntun2"
      ],
      "connected": 1,
      "total": 4
    },
    "roadwarrior": {
      "auth": "certificate",
      "interfaces": [
        "tunrw"
      ],
      "mode": "routed",
      "status": "enabled",
      "connected": 0,
      "topTrafficAccounts": [
        {
          "traffic": 7261,
          "account": "test-account"
        },
        {
          "traffic": 6093,
          "account": "andreal"
        }
      ],
      "port": "1194",
      "total": 4
    }
  },
  "ipsec": {
    "connected": 0,
    "total": 2
  }
}
```

#### chart

Output example:
```json
{
  "data": [
    [
      1559931434,
      10,
      120
    ],
    [
      1559931433,
      2,
      345
    ],
    ...
  ],
  "labels": [
    "time",
    "received",
    "sent"
  ]
}
```
