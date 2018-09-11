# system-hosts

Manage DNS records for DNSMasq.

## read

### Input

Return all current configured records from the `hosts` file inside the `status` field.
Return all `remote` records  from `hosts` database inside the `configuration field.

```json
{
  "status": {
    "127.0.0.1": [
      "localhost",
      "localhost.localdomain"
    ],
    "192.168.1.2": [
      "t1.net.loc"
    ],
    "192.168.5.246": [
      "test.local.neth.eu",
      "test"
    ]
  },
  "configuration": [
    {
      "props": {
        "IpAddress": "192.168.1.2",
        "Description": "",
        "WildcardMode": "disabled"
      },
      "name": "t1.net.loc",
      "type": "remote"
    }
  ]
}
```

## validate

### Constraints

- The key (`name field`) must be a valid FQDN and must not already exists in case of creation
- WildcardMode can be enabled or disabled
- IpAddress must be a valid IPv4 address

### Input

A `remote` host esmith db record in JSON format.
The record must also contain an `action` fields which can be:
- `create` for new dns record creation
- `update` when updating and existing record

Example:
```json
{
    "props": {
        "IpAddress": "192.168.1.2",
        "Description": "",
        "WildcardMode": "disabled"
    },
    "name": "t1.net.loc",
    "type": "remote",
    "action": "create"
}
```

## update

Use the same input from validate.

## create

Use the same input from validate.

## delete

Pass the the key to be deleted inside the `name` field.

Example:
```json
{
    "name": "my.host.com"
}
```
