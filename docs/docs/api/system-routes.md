# system-routes

Manage static routes records from `routes` db.

## read

### Output

Return all current configured static routes grouped by network interface.

```json
{
  "status": null,
  "configuration": {
    "br0": [
      {
        "Router": "10.10.10.1",
        "Metric": "12",
        "name": "10.10.10.0/24",
        "Description": "t1"
      },
      {
        "Router": "11.11.11.1",
        "Metric": "",
        "name": "11.11.11.0/24",
        "Description": ""
      }
    ]
  }
}
```

## validate

Each request must contain an `action` field.

Valid actions are:

- `create`
- `update`

### Constraints

Constraints for action `create`:

- key (`name` field): must be a valid CIDR, or `0.0.0.0/0` or `default`
- Device: an existing network inteface
- Router: a valid IPv4 address
- Metric: empty or positive integer

Constraints for action `update`:

- key (`name` field): must be a valid CIDR, or `0.0.0.0/0` or `default`
- Device: an existing network inteface
- Router: a valid IPv4 address
- Metric: empty or positive integer

### Input

#### create

Example:
```json
{
  "action": "create",
  "Device": "br0",
  "name": "11.11.12.0/24",
  "Router": "1.2.3.4",
  "Desription": "desc 1",
  "Metric": ""
}
```

#### update

Example:
```json
{
  "action": "update",
  "Device": "br0",
  "name": "11.11.12.0/24",
  "Router": "1.2.3.4",
  "Desription": "desc 1",
  "Metric": ""
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
  "name": "11.11.12.0/24",
}
```

Invocation example:
```bash
echo '{"name":"11.11.12.0/24"}' | ./delete
```
