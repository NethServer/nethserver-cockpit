# send

Manage mail sending policies.

## read

### Output

Return current configuration.
Output example:
```json
{
  "AccessBypassList": [
    "1.2.3.4"
  ],
  "SenderValidation": "disabled",
  "AccessPoliciesSmtpauth": "enabled",
  "AccessPoliciesTrustednetworks": "disabled",
  "HeloHost": ""
}
```

## validate

Valid actions:

- `configuration`: validate global configuration


### Constraints

- AccessBypassList: a list of valid mail IP address or empty
- AccessPoliciesSmtpauth SenderValidation AccessPoliciesTrustednetworks: can be `enabled` or `disabled`
- HeloHost: a valid FQDN or empty
 

### Input

Use tha same format as read API.

Example:
```json
{
  "AccessBypassList": [
    "1.2.3.4"
  ],
  "SenderValidation": "disabled",
  "AccessPoliciesSmtpauth": "enabled",
  "AccessPoliciesTrustednetworks": "disabled",
  "HeloHost": "nethserver.org",
  "action": "configuration"
}
```


## update

Same input as validate.
