# dashboard

Samba usage basic statistics.

## read

The read API requires an `action` field.
Valid actions are:

- `ibays`
- `smbstatus`

Input example:
```json
{
  "action": "ibays"
}
```

### Output

#### ibays

Return basic statistics about ibay configuration and disk usage (if duc is installed).

Output example:
```json
{
  "workgroup": "LOCAL",
  "count": 2,
  "files": {
    "iba2": 3,
    "iba1": 8
  },
  "du": {
    "iba2": 42266624,
    "iba1": 25665536
  },
  "updated":1558416090
}
```

#### smbstatus

Retrieve connections and file status using `smbstatus`.

Output example:
```json
[
  {
    "protocol": "SMB3_11",
    "mode": "-",
    "connected": "Thu May  9 12:18:58 2019 CEST",
    "name": "giacomo",
    "path": "-",
    "encryption": "partial(AES-128-CMAC)",
    "service": "iba1",
    "username": "giacomo@local.neth.eu",
    "group": "domain users@local.neth.eu",
    "oplock": "-",
    "machine": "192.168.1.1"
  },
  {
    "protocol": "SMB3_11",
    "mode": "-",
    "connected": "Thu May  9 12:18:57 2019 CEST",
    "name": "giacomo",
    "path": "-",
    "encryption": "partial(AES-128-CMAC)",
    "service": "iba2",
    "username": "giacomo@local.neth.eu",
    "group": "domain users@local.neth.eu",
    "oplock": "-",
    "machine": "192.168.1.1"
  }
]
```
