# dashboard

Return statistics from Suricata and Evebox.

## read

The read API takes an `action` field.

Valid actions are:

- `stats`
- `status`

Input example:
```json
{
  "action": "stats"
}
```

### Output

#### stats

Output example:
```json
{
  "alerts": {
    "severities": {
      "low": 21
    },
    "sources": [
      {
        "hits": 8,
        "name": "192.168.5.246"
      },
      {
        "hits": 7,
        "name": "192.168.5.253"
      },
      {
        "hits": 3,
        "name": "192.168.100.194"
      },
      {
        "hits": 1,
        "name": "192.168.5.22"
      },
      {
        "hits": 1,
        "name": "8.8.8.8"
      },
      {
        "hits": 1,
        "name": "192.168.100.1"
      }
    ],
    "categories": {
      "unknown": 21
    },
    "destinations": [
      {
        "hits": 8,
        "name": "192.168.5.253"
      },
      {
        "hits": 8,
        "name": "192.168.5.246"
      },
      {
        "hits": 2,
        "name": "192.168.100.194"
      },
      {
        "hits": 1,
        "name": "192.168.5.22"
      },
      {
        "hits": 1,
        "name": "8.8.8.8"
      },
      {
        "hits": 1,
        "name": "192.168.100.1"
      }
    ],
    "total": 21
  },
  "flows": {
    "udp": 130,
    "tcp": 551,
    "icmp": 1
  },
  "rules_loaded": 120,
  "uptime": 1227,
  "rules_failed": 0,
  "counters": {
    "rejected": 0,
    "replaced": 0,
    "blocked": 194,
    "accepted": 348839
  }
}
```

#### status

Output example:
```json
{
  "BlockCategories": [],
  "status": "enabled",
  "AlertCategories": []
}
```
