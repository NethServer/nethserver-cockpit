# system-authorization

Read the list of modules accessible by the user.

## read

### Output

It returns the list of enabled modules for the user.

- isRoot ('1' or '0'), validate that the user is `root`.
- isAdmin('1' or '0'), validate  that the user is member of the group `domain admins` (root returns '1').
- username, return the name of the user who uses the script
- Token, It is the otpauth url needed to create a QRcode (you can use qrencode in the terminal)
- OtpSshd ('enabled' or 'disabled'), it forces the user to use otp for the ssh login
- OtpCockpit ('enabled' or 'disabled'), it forces the user to use otp for the cockpit login
- OtpStatus ('enabled' or 'disabled') it enables globally the otp(2FA) feature, if disabled, the secret stored under the ``~/.2fa.secret`` is removed
- Code, it is the HOTP codes, commonly named recovery code (one time code use)
- Key, it is the private key stored under ``~/.2fa.secret``
- Secret, it is the public key of ``~/.2fa.secret``

Example:
```json
{
  "system": [
    "storage",
    "disk-usage",
    "certificates",
    "dns",
    "services",
    "users-groups",
    "network",
    "ssh",
    "tls-policy",
    "trusted-networks",
    "logs",
    "wizard",
    "applications",
    "software-center"
  ],
    "status": {
    "isRoot": 1,
    "isAdmin": 1,
    "username": "root"
  },
  "applications": [
    "nethserver-nextcloud"
  ],
  "Token": "otpauth://totp/root@ns7loc11.nethservertest.org?secret=N54UNVYMKSW6LBQ66Q4GEJZRJGG6KQSL",
  "OtpSshd": "enabled",
  "OtpStatus": "enabled",
  "Code": [
    "902296",
    "757781",
    "089364",
    "150167",
    "993272"
  ],
  "OtpCockpit": "enabled",
  "Key": "6f7946d70c54ade5861ef438622731498de5424b",
  "Secret": "N54UNVYMKSW6LBQ66Q4GEJZRJGG6KQSL"

}
```
## validate

Check if a user has access to a given module.

### Constraints

- the user must belong to a group with permission to access the module
- action field can be `check-system` or `check-app`


### Input

Valid actions are listed below.

#### check-system


Check if the user can access given system module.

Example:
```json
{
  "action": "check-system",
  "name": "dns"
}
```

### check-app

Check if the user can access given application.

Example:
```json
{
  "action": "check-app",
  "name": "nethserver-nextcloud"
}
```

