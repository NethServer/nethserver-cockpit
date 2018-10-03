# system-password-policy

Read and set `passwordstrength` record from `configuration` db.

## read

### Output

The `configuration` key contains the `OrganizationContact` record.

Output example:
```json
{
  "status": "",
  "configuration": {
    "props": {
      "PassExpires": "no",
      "MinPassAge": "0",
      "MaxPassAge": "180",
      "Users": "no",
    },
    "name": "passwordstrength",
    "type": "configuration"
  }
}
```

## validate

### Constraints

- PassExpires and Users: must be `yes` or `no`
- MinPassAge: minimum 0, maximum 365
- MaxPassAge: positive integer

### Input

Input: an esmith db record in JSON format.

Input example from: `config getjson OrganizationContact`:
```json
{
  "props": {
    "PassExpires": "no",
    "MinPassAge": "0",
    "MaxPassAge": "180",
    "Users": "no",
  },
  "name": "passwordstrength",
  "type": "configuration"
}
```

## update

Same input from validate helper.
