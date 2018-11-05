# system-logrotate

Configure logrotate.

## read

### Output

The `configuration` key contains the `logrotate` record.

Output example:
```json
{
  "status": "",
  "configuration": {
    "props": {
      "Times": "4",
      "Compression": "disabled",
      "Rotate": "weekly"
    },
    "name": "logrotate",
    "type": "configuration"
  }
}
```

## validate

### Constraints

- Times: must be a positive integer
- Rotate: can be `daily`, `weekly`, `monthly`
- Compression: can be `enabled` or `disabled`

### Input

Input: an esmith db record in JSON format.

Input example from: `config getjson OrganizationContact`:
```json
{
  "props": {
    "Times": "4",
    "Compression": "disabled",
    "Rotate": "weekly"
  },
  "name": "logrotate",
  "type": "configuration"
}
```

## update

Same input from validate helper.
