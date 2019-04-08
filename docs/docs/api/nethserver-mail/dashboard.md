# dashboard

NethServer mail server/filter basic statistics.

## read

The read API requires an `action` field.
Valid actions are:

- `live`
- `logs`

Input example:
```json
{
  "action": "live"
}
```

### Output

#### live

Return basic statistics for the dashaboard reading the system status.

Output example:
```json
{
  "quota": {
    "messages": 2130824,
    "status": "enabled",
    "size": 115853889
  },
  "connections": {
    "smtp": "0",
    "pop3": "0",
    "submission": "0",
    "pop3s": "0",
    "imap": "98",
    "imaps": "6"
  },
  "statistics": {
    "domains": 4,
    "pseudonyms": 149,
    "mailboxes": 83,
    "externals": 0
  },
  "services": {
    "postfix": 1,
    "rspamd": 1,
    "dovecot": 1,
    "clamd@rspamd": 1,
    "opendkim": 0
  },
  "clamav-update": 1552309754,
  "rspamd": {
    "version": "1.8.3",
    "learned": 10612,
    "clean": 537861,
    "scanned": 764908,
    "auth": "ok",
    "greylist": 6790,
    "read_only": false,
    "uptime": 905285,
    "probable": 23171,
    "config_id": "xxxx",
    "reject": 197086,
    "soft_reject": 0
  },
  "packages": {
    "disclaimer": 0,
    "filter": 1,
    "getmail": 0,
    "server": 1,
    "p3scan": 0
  },
  "domains": [
    "nethesis.it",
    "nethserver.org",
  ],
  "configuration": {
    "VirusCheckStatus": "enabled",
    "BlockAttachmentStatus": "enabled",
    "SmartHostStatus": "disabled",
    "SpamCheckStatus": "enabled"
  },
  "queue": 0
}
```

#### logs

Analyze current `/var/log/maillog` using a modified version of pflogsum.
The result is cached for one hour inside `/var/spool/nethserver-cockpit/nethserver-mail/logs-cache.json`.

Output example:
```json
{
  "recipients-size": [
    {
      "value": 134734818,
      "address": "test@nethesis.it"
    },
    ...
  ],
  "sending-domains": [
    {
      "bytes": 40948466,
      "count": 4462,
      "domain": "nethserver.orf"
    },
    ...
  ],
  "messages": {
    "discarded": 0,
    "held": null,
    "senders": 1781,
    "bytes_delivered": 932202864,
    "rejected_percentage": 10,
    "discarded_percentage": 0,
    "delivered": 13859,
    "recipient_hosts": 253,
    "forwarded": 1,
    "reject_warnings": null,
    "received": 16084,
    "recipients": 431,
    "rejected": 1570,
    "bytes_received": 518048313,
    "bounced": 11,
    "deferred": 18,
    "sending_hosts": 721
  },
  "senders-size": [
    {
      "value": 36427852,
      "address": "muyser@nethserver.org"
    },
    ...
  ],
  "recipients-count": [
    {
      "value": 1757,
      "address": "test3@nethserver.org"
    },
    ...
  ],
  "senders-count": [
    {
      "value": 448,
      "address": "test4@nethserver.org"
    },
    ...
  ],
  "smtpd": {
    "hosts": 0,
    "connections": 0,
    "avg_conn_sec": 0
  },
  "day-stats": {
    "data": [
      [
        1553986800,
        890,
        279,
        0,
        0,
        150
      ],
      ...
    ],
    "labels": [
      "day",
      "received",
      "delivered",
      "deferred",
      "bounced",
      "rejected"
    ]
  },
  "recipient-domains": [
    {
      "bytes": 726568488,
      "domain": "nethserver.org",
      "sent": 11739,
      "defers": null,
      "max_daily": "181",
      "avg_daily": 1.26683959451403
    },
    ...
  ],
  "hour-stats": {
    "data": [
      [
        0,
        52.1666666666667,
        21.8333333333333,
        0.666666666666667,
        0.5,
        6.66666666666667
      ],
      ...
    ],
    "labels": [
      "hour",
      "received",
      "delivered",
      "deferred",
      "bounced",
      "rejected"
    ]
  }
}
```
