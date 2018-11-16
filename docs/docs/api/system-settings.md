# system-settings

General module to manage multiple system settings:

- smart host configuration
- mail forward
- cockpit configuration
- log rotation configuration

This API returns different output based on the running user.
Do not invoke the helpers using `sudo`.

This route is accessible from all users.

## read

Read the configuration of all system settings and hints.
Requires an `action` field.

Valid actions are:

- `settings`: return all system settings
- `hints`: return the status of hints, if the user is non-root, hints are always disabled

### Input

Input example:
```json
{
  "action": "hints"
}
```

### Output

#### settings

Example for normal user:
```json
{
  "status": {
    "canChangePassword": 1,
    "isRoot": 0
  },
  "configuration": null
}
```

The `canChangePassword` field is set to 0 if the account provider is remote.

Example for root user:
```json
{
  "status": {
    "canChangePassword": 1,
    "isRoot": 1
  },
  "configuration": {
    "cockpit": {
      "LimitAccess": "",
      "access": "green,red",
      "ShowHints": "enabled"
    },
    "smarthost": {
      "SmartHostPassword": "",
      "SmartHostPort": "25",
      "SmartHostTlsStatus": "enabled",
      "SmartHostUsername": "",
      "SmartHostName": "",
      "SmartHostStatus": "disabled"
    },
    "root": {
      "SenderAddress": "no-reply@nethserver.org",
      "KeepMessageCopy": "yes",
      "EmailAddress": []
    },
    "logrotate":{
        "Compression": "disabled",
        "Rotate": "weekly",
        "Times": "52"
    }
  }
}
```

#### hints

Example:
```json
{
  "hints": "enabled"
}
```

## validate

Requires an `action` parameter.
Valid actions are:

- `root`
- `cockpit`
- `smarthost`
- `hints`
- `logrotate`

### Constraints

Constraints for `root` action:

- SenderAddress: a valid mail address
- KeepMessageCopy: can be "yes" or "no"
- EmailAddress: empty or an array of valid mail addresses

Constraints for `cockpit` action:

- access: can be "green" or "green,red"
- LimitAccess: empty or an array of valid mail IP addresses or CIDR

Constraints for `smarthost` action:

- SmartHostPort: valid TCP port
- SmartHostTlsStatus, SmartHostStatus: can be "enabled" or "disabled"
- SmartHostName: an host name or IP address
- SmartHostPassword, SmartHostUsername: anything

Constraints for `hints` action:

- ShowHints: can be "enabled" or "disabled"

Constraints for `logrotate` action:

- Compression: can be "enabled" or "disabled"
- Rotate: can be "daily", "weekly" or "monthly"
- Times: must be a positive integer number

### Input

Takes the same parameters from read output plus an action field.

#### root

Input example:
```json
{
  "action": "root",
  "SenderAddress": "no-reply@nethserver.org",
  "KeepMessageCopy": "yes",
  "EmailAddress": [
    "mail1@nethserver.org",
    "mail2@nethserver.org"
  ]
}
```

#### cockpit

Input example:
```json
{
  "action": "cockpit",
  "access": "green,red",
  "LimitAccess": [
    "192.168.1.1"
  ],
  "ShowHints": "enabled"
}
```

#### smarthost

Input example:
```json
{
  "action": "smarthost",
  "SmartHostPassword": "",
  "SmartHostPort": "25",
  "SmartHostTlsStatus": "enabled",
  "SmartHostUsername": "",
  "SmartHostName": "mymailserver.nethserver.org",
  "SmartHostStatus": "enabled"
}
```

#### hints

Input example:
```json
{
  "action": "hints",
  "ShowHints": "enabled",
}
```
#### logrotate

Input example:
```json
{
  "action": "logrotate",
  "Compression": "disabled",
  "Rotate": "weekly",
  "Times": "52"
}
```

## update

Use same input from validate.

### Input

Takes the same actions from validate.

#### root

Same as validate.

#### smarthost

Same as validate.

#### cockpit

Same as validate.

#### hints

Same as validate.

#### logrotate

Same as validate

## hints

Available hints:

- the root user is using the default password
- cockpit port is open to the red network without IP limitations

### Output

Example:
```json
{
  "link": "",
  "count": 2,
  "details": {
    "Password": "change_default_root_password",
    "LimitAccess": "limit_red_access_by_ip"
  },
  "message": null
}
```
