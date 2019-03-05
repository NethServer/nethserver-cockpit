# settings

Configure global flags and apply/reset/restore the firewall configuration.

## read

### Input

The read API requires an action field.
Valid actions:

- `settings`
- `status`

Example:
```json
{
  "action": "settings"
}
```

### Output

#### settings

Return the firewall global properties.

Output example:
```json
{
  "settings": {
    "ExternalPing": "enabled",
    "Policy": "permissive",
    "MACValidationPolicy": "drop",
    "MACValidation": "disabled"
  }
}
```

#### status

Return the status of the firewall.
Available fields:

- `CanRestore`: set to 1 if firewall backup is present and can be restored, 0 otherwise
- `CanApply`: set to 1 if firewall configuration has been changed but not applied, 0 otherwise.

If `CanApply` is set to 1, the configuration can be `reset` to the running one.

Output example:
```json
{
  "status": {
    "CanRestore": 1,
    "CanApply": 0
  }
}
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `settings'

Constraints for `settings` action:

- MACValidation and ExternalPing: can be `enabled` or `disabled`
- Policy: can be `permissive` or `strict`
- MACValidationPolicy: can be `drop` or `accept`

### Input

#### settings

Example:
```json
{
  "action": "settings",
  "ExternalPing": "enabled",
  "Policy": "permissive",
  "MACValidationPolicy": "drop",
  "MACValidation": "disabled"
}
```

## update

Same input format from validate for `settings` action.
Execute the `firewall-adjust` event.

#### reset

Reset the configuration to the running one.
No event is fired.

Example:
```json
{
  "action": "reset"
}
```

#### apply

Apply modified configuration.
Execute the `firewall-adjust` event.

Example:
```json
{
  "action": "apply"
}
```

#### restore

Restore the configuration previous to the last `apply`.
Execute the `firewall-adjust` event.

Example:
```json
{
  "action": "restore"
}
```
