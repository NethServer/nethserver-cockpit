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
      "bytes_total": 5328656,
      "dport_reply": "22",
      "dst_reply": "192.168.5.246",
      "protocol": "tcp",
      "bytes": "978988",
      "nat": 0,
      "zone": "0",
      "status": "ASSURED",
      "sport_reply": "55038",
      "packets": "3993",
      "packets_reply": "5304",
      "dport": "55038",
      "state": "ESTABLISHED",
      "mark": "23552",
      "use": "2",
      "timeout": "299",
      "src_reply": "192.168.5.22",
      "src": "192.168.5.246",
      "layer": "ipv4",
      "bytes_reply": "4349668",
      "packets_total": 9297,
      "sport": "22",
      "dst": "192.168.5.22"
    },
    ...
  ]
}
```

#### stats

Example:
```json
{
  "connections": [
    "19",
    "18",
    "18",
    ....
  ],
  "time": [
    "1551362111",
    "1551362110",
    "1551362109",
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

