# connections

Manage conntrack table.

## read

### Input

The read API requires an action field.
Valid actions:

- `conntrack`
- `protocols`
- `stats`

#### protocols

List the available protocols along with their states.

Example:
```json
{
  "action": "protocols"
}
```

#### conntrack

Return the list of connections filtered by `protocol` and `state`.
If `limit` is set, return only the first `limit` connections.

Example:
```json
{
  "action": "conntrack",
  "protocol": "tcp",
  "state" : "ESTABLISHED",
  "limit": 25
}
```

#### stats

Return the connection number in the last 30 seconds from netdata.

Example:
```json
{
  "action": "stats"
}
```

### Output

#### protocols

Example:
```json
{
  "protocols": {
    "udp": [],
    "tcp": [
      "CLOSE",
      "CLOSE_WAIT",
      "ESTABLISHED",
      "FIN_WAIT",
      "LAST_ACK",
      "LISTEN",
      "NONE",
      "SYN_SENT",
      "SYN_RECV",
      "TIME_WAIT"
    ],
    "icmp": []
  }
}
```

#### conntrack

List active connections sorted in descending order by:

- `bytes_total`, if accounting is enabled
- `timeout`, if accounting is disabled

Example:
```json
{
  "connections": [
    {
      "provider": "",
      "bytes_total": 220177,
      "dport_reply": "55142",
      "dst_reply": "80.17.99.73",
      "protocol": "tcp",
      "bytes": "97369",
      "nat": 1,
      "zone": "0",
      "status": "ASSURED",
      "sport_reply": "443",
      "packets": "1503",
      "packets_reply": "1016",
      "dport": "443",
      "state": "ESTABLISHED",
      "mark": "0x5b03",
      "use": "2",
      "timeout": "431978",
      "ndpi": "SSL",
      "src_reply": "54.208.55.14",
      "src": "192.168.5.31",
      "prio": "low",
      "layer": "ipv4",
      "bytes_reply": "122808",
      "packets_total": 2519,
      "sport": "55142",
      "dst": "4.8.55.14"
    },
    ...
  ]
}
```

#### stats

Example:
```json
{
  "data": [
    [
      1553521929,
      422
    ],
    [
      1553521928,
      423
    ]
  ],
  "labels": [
    "time",
    "connections"
  ]
}
```

## delete

The read API requires an action field.
Valid actions:

- `flush`
- `connection`

### Input

#### flush

Delete all active connections.

Example:
```json
{
  "action": "flush"
}
```

#### connection

Delete selected connction.
Required fields are: `protocol`, `src`, `dst`.
If `protocol` is `udp` or `tcp`, also `sport` and `dport` are required.

Example:
```json
{
  "action": "connection",
  "protocol": "icmp",
  "dport": 389,
  "sport": 46286,
  "src": "10.0.0.212",
  "dst": "1.2.3.4"
}
```

