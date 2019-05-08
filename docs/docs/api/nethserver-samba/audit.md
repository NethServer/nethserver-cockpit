# audit

Display and manage Samba Audit logs.

## read

### Input

The read API requires an `action` field.
Valid actions are:

- `query`

#### query

Execute a query inside the database with given filters.
If no filter is given, all records are returned.

Input example:
```json
{
  "action": "query",
  "username": "myuser",
  "address": "",
  "share": "",
  "operation": "",
  "message": "",
  "from": "1546300800",
  "to": "1557360000"
}
```

### Output

##### query

Output example:
```json
[
  {
    "id": "17",
    "when": "2019-05-08 15:13:05",
    "share": "iba1",
    "ip": "192.168.1.22",
    "user": "giacomo@local.neth.eu",
    "op": "read",
    "result": "ok",
    "arg": "test.log"
  },
  {
    "id": "20",
    "when": "2019-05-08 16:49:59",
    "share": "iba1",
    "ip": "192.168.1.22",
    "user": "giacomo@local.neth.eu",
    "op": "write",
    "result": "ok",
    "arg": "test.log"
  },
  {
    "id": "21",
    "when": "2019-05-08 16:50:05",
    "share": "iba1",
    "ip": "192.168.1.22",
    "user": "giacomo@local.neth.eu",
    "op": "rename",
    "result": "ok",
    "arg": "test.log -> test2.log"
  }
  ...
]
```

## update

The update API parses `/var/log/smbaudit.log` log and insert records inside the database.

No input is required.

## delete

The delete API takes the same input from `read` API for the `query` action.
Selected records are deleted instead of returned.

Output example:
```json
{
  "state": "success",
  "deleted": 2
}
```
