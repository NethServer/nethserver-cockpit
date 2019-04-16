# settings

Manage general mail settings.

## read

### Output

Return current configuration.
Output example:
```json
{
  "AlwaysBccStatus": "disabled",
  "AlwaysBccAddress" : "",
  "MessageSizeMax": "20",
  "MessageQueueLifetime": "4",
  "AlwaysBccAddress": ""
}
```

## validate

### Constraints

- AlwaysBccStatus: can be `enabled` or `disabled`
- AlwaysBccAddress: must be a valid email address, if AlwaysBccStatus is enabled
- MessageSizeMax: positive integer, less than 1001
- MessageQueueLifetime: positive integer, less than 31

### Input

Use tha same format as read API.

Example:
```json
{
  "AlwaysBccStatus": "enabled",
  "AlwaysBccAddress" : "spy@nethserver.org",
  "MessageSizeMax": "20",
  "MessageQueueLifetime": "4",
  "AlwaysBccAddress": ""
}
```

## update

Same input as validate.
