# system-trusted-networks

Manage trusted networks records from `networks` db.

## read

### Output

Return all current configured records from `/usr/libexec/nethserver/trusted-networks` inside the `status` field.
Return all `network` records  from `networks` database inside the `configuration field.

```json
{
  "status": [
    {
      "provider": "green",
      "cidr": "192.168.1.0/24",
      "mask": "192.168.1.0/255.255.255.0"
    },
    {
      "provider": "networksdb",
      "cidr": "10.0.0.0/24",
      "mask": "10.0.0.0/255.255.255.0"
    }
  ],
  "configuration": [
    {
      "props": {
        "Mask": "255.255.255.0",
        "Description": "my trusted net"
      },
      "name": "10.0.0.0",
      "type": "network"
    }
  ]
}
```

## validate

### Constraints

- the key (`name` field) must be a valid IPv4 address
- Mask must be a valid IPv4 netmask
- the combination of name and Mask must be a valid network
- the network should not be used inside the system, for example on a network interface

### Input

A `network` esmith db record in JSON format.
The record must also contain an `action` fields which can be:
- `create` for new dns record creation
- `update` when updating and existing record

Example:
```json
{
  "props": {
    "Mask": "255.255.255.0",
    "Description": "my net 11"
  },
  "name": "11.0.0.0",
  "type": "network",
  "action": "update"
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
  "name": "11.0.0.0",
  "action": "delete"
}
```

Invocation example:
```bash
echo '{"name":"11.0.0.0","action":"delete"}' | ./delete
```
