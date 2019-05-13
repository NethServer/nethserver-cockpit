# dashboard

Return statistics from Suricata and Evebox.

## read

The read API takes an `action` field.

Valid actions are:

- `statistics`
- `status`

### Input

#### statistics

It takes a `host` parameter which is used to calculate Evebox URL.

Input example:
```json
{
  "action": "statistics",
  "host": "my.server.org"
}
```

#### status

Input example:
```json
{
  "action": "status"
}
```

### Output

#### statistics

Output example:
```json
{
  "alerts": {
    "severities": {
      "high": 0,
      "medium": 0,
      "low": 21
    },
    "sources": [
      {
        "hits": 8,
        "name": "192.168.1.246"
      },
      {
        "hits": 7,
        "name": "192.168.1.253"
      },
      {
        "hits": 3,
        "name": "192.168.100.194"
      },
      {
        "hits": 1,
        "name": "192.168.1.22"
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
        "name": "192.168.1.253"
      },
      {
        "hits": 8,
        "name": "192.168.1.246"
      },
      {
        "hits": 2,
        "name": "192.168.100.194"
      },
      {
        "hits": 1,
        "name": "192.168.1.22"
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
  "counters": {
    "replaced": 0,
    "rejected": 0,
    "rules_loaded": 100,
    "accepted": 2136462,
    "blocked": 781,
    "uptime": 10460,
    "rules_failed": 0
  },
  "url": "https://my.server.org:980/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
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
