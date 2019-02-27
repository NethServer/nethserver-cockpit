# connections

Manage conntrack table.

## read

### Input

The read API requires an action field.
Valid actions:

- `conntrack`
- `protocols`

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

If `expand` is set to 1, retrieve also the zone for each address.

Example:
```json
{
  "action": "conntrack",
  "protocol": "tcp",
  "state" : "ESTABLISHED",
  "expand": 0
}
```

### Output

#### protocols

Example:
```json
{
  "protocols": {
    "udp": [
      "CLOSED",
      "COOKIE_WAIT",
      "COOKIE_ECHOED",
      "ESTABLISHED",
      "NONE",
      "SHUTDOWN_SENT",
      "SHUTDOWN_RECD",
      "SHUTDOWN_ACK_SENT"
    ],
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

Example:
```json
{
  "connections": [
    {
      "dport_reply": "47394",
      "dst_reply": "127.0.0.1",
      "protocol": "tcp",
      "nat": 0,
      "zone": "0",
      "status": "ASSURED",
      "sport_reply": "389",
      "dport": "389",
      "state": "ESTABLISHED",
      "mark": "28672",
      "use": "2",
      "timeout": "431986",
      "src_reply": "127.0.0.1",
      "src": "127.0.0.1",
      "layer": "ipv4",
      "sport": "47394",
      "dst": "127.0.0.1"
    },
    ...
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

