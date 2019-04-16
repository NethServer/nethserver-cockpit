# send

Manage mail sending policies.

## read

The read API requires an `action` field:

- `configuration`
- `list`
- `check-credentials`

### Input

#### configuration

Return current global configuration.

Input example:
```json
{
  "action": "configuration"
}
```

#### list

Return the list of current configured smarthost (except the default one):

Input example:
```json
{
  "action": "list"
}
```

#### check-credentials

Check cre

```json
{
  "action": "check-credentials",
  "Host": "my.remotehost.com",
  "Password": "Nethesis,1234",
  "Username": "giacomo",
  "Port": "587"
}
```

### Output

#### configuration

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

#### list

List configured smarthosts per sender.

Example:
```json
{
  "smarthosts": [
    {
      "props": {
        "Password": "mypass",
        "TlsStatus": "enabled",
        "Username": "test1",
        "status": "enabled",
        "Port": "587",
        "Host": "localhost"
      },
      "name": "test1@nethserver.org",
      "type": "sender"
    },
    ...
  ]
}
```


#### check-credentials

Return standard success or error message.

Example:
```json
{
  "action": "check-credentials",
  "Username": "myuser",
  "Password": "mypass",
  "Host": "localhost",
  "TlsStatus": "disabled",
  "Port": "587"
}
```

## validate

Valid actions:

- `configuration`: validate global configuration
- `update`: update an existing smart host
- `create`: create a new smart host


### Constraints


Constraints for `configuration` action:

- AccessBypassList: a list of valid mail IP address or empty
- AccessPoliciesSmtpauth SenderValidation AccessPoliciesTrustednetworks: can be `enabled` or `disabled`
- HeloHost: a valid FQDN or empty
 
Constraints for `update` action:

- name: must be an existing key, it can be a valid mail address or a domain starting with "@" symbol
- Host: valid hostname
- Port: valid port
- TlsStatus: can be `enabled` or `disabled`

Constraints for `create` action:

- name: must be a non-existing key, it can be a valid mail address or a domain starting with "@" symbol
- Host: valid hostname
- Port: valid port
- TlsStatus: can be `enabled` or `disabled`

### Input

#### configuration

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

#### update

Example:
```json
{
  "action": "update",
  "Password": "mypass",
  "TlsStatus": "enabled",
  "Username": "test1",
  "status": "enabled",
  "Port": "587",
  "Host": "smtp.test.org",
  "name": "test3@nethserver.org"
}
```

#### create

Example:
```json
{
  "action": "create",
  "Password": "mypass",
  "TlsStatus": "enabled",
  "Username": "test1",
  "status": "enabled",
  "Port": "587",
  "Host": "smtp.test.org",
  "name": "3@nethserver.org"
}
```

## update

Same input as validate.

Extra valid actions:

- `enable`: enable given smarthost
- `disable`: disable given smarthost

### Input

#### enable

Example:
```json
{
  "action": "enable",
  "name": "sender1@nethserver.org"
}
```

#### disable

Example:
```json
{
  "action": "disable",
  "name": "sender1@nethserver.org"
}
```

## delete

Delete the given smarthost.

Example:
```json
{
  "name": "sender1@nethserver.org"
}
```

