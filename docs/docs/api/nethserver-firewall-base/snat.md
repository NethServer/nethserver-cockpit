# snat

Manage source nat.

## read

### Input

The read API requires an action field.
Valid actions:

- `list`

#### list

Return the list of red aliases with associated forward host (if any).

Example:
```json
{
  "action": "list"
}
```

### Output

Output example:
```json
{
  "aliases": [
    {
      "FwObjectNat": "host;myhost",
      "name": "ens8:0",
      "ipaddr": "1.2.3.4"
    },
    ...
  ]
}
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `create`
- `update`
- `delete`

Constraints for all actions:

- name: an existing alias
- FwObjectNat: null, empty or valid host object

### Input

Example:
```json
{
  "action": "update",
  "FwObjectNat": "",
  "name": "ens8:0"
}
```

## update

Same input format from validate action.

## create

It uses the same format from validate action.

## delete

It uses the same format from validate action.
