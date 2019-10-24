# audit

Display and manage Samba Audit logs.

## read

### Input

It requires an `action` field. Available actions:

- `file-access`
- `file-access-details`


#### file-access

Return the list of last actions for each user inside the database.

Example:
```json
{
  "action": "file-access",
  "message": "",
  "hostname": "myhost.nethserver.org"
}
```

If `message` is set, search for actions that match the given file path.

#### file-access-details

Return the list of all operations for the given user on the given path.
Operations results are limited to 500 entries.

Example:
```json
{
  "action": "file-access-details",
  "username": "myuser@nethserver.org",
  "share": "server",
  "message": "w|readme.txt",
  "from": 1570744800,
  "to": 1570831140,
}
```

### Output

#### file-access

Output example:
```json
{
  "list": [
    {
      "when": "2019-10-10 19:28:50",
      "user": "myuser@nethserver.org",
      "share": "share1",
      "op": "write",
      "arg": "readme.txt",
      "raw_arg": "w|readne.txt"
    },
    ...
  ],
  "updated": "1570937859",
  "alias": "https://myserver.nethserver.org/43dggryttfghftuuunnhjju5654641a4b7cb233a"
}
```

#### file-access-details

Output example:
```json
[
  {
    "when": "2019-10-11 00:30:10",
    "op": "write"
  },
  {
    "when": "2019-10-11 12:30:14",
    "op": "unlink"
  }
]
```


## update

The update API parses `/var/log/smbaudit.log` log and insert records inside the database.

No input is required.

