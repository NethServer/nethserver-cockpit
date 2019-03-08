# dashboard

NethServer mail server/filter basic statistics.

## read

No input is required.

### Output

Return basic statistics for the dashaboard.

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
    "config_id": "ht8yrmad6cjj61467t63yx37h744kkh9xabztno8i1m5x5si46nmsptc7kh4qdo861zth5xzai61mx154fe8a6h33i6yapun4t8otpb",
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
