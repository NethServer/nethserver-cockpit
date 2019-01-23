# objects

Manage fireall objects

## read

### Input

The read API requires an action field.
Valid actions:

- `hosts`

#### hosts

Return the list of hosts from `hosts` database.

Example:
```json
{
  "action": "hosts"
}
```

### Output

#### hosts

Output example:
```json
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `host`

Constraints for `create`:

- name: must be a non-existing class

Constraints for `update`:

- name: must be an existing class

### Input

#### create

Example:
```json
```

#### update

Example:
```json
```

#### delete

Example:
```json
{
  "action": "delete",
  "name": "myobject"
}
```


## update

Same input format from validate action.

## create

It uses the same format from input action.

## delete

It uses the same format from input action.
