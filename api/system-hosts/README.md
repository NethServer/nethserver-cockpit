# system-hosts

Read and set upstream DNS records for DNSMasq.

# read

## Input

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

# validate

## Constraints

- The key (`name field`) bust me a valid FQN
- WildcardMode can be enabled or disabled
- IpAddress must be a valid IPv4 address

## Input

A `remote` host esmith db record in JSON format.

Example:
```json
{
    "props": {
        "IpAddress": "192.168.1.2",
        "Description": "",
        "WildcardMode": "disabled"
    },
    "name": "t1.net.loc",
    "type": "remote"
}


# update

Use the same input of validate.

# create

Use the same input of validate.

# delete

Take the key to delete inside the `name` field.

Example:
```json
{
    "name": "my.host.com"
}
```
