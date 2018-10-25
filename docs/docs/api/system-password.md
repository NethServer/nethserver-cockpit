# system-password

Change password of the logged user.

This API should not be invoked using `sudo`.

## validate

The validation helper uses system-users library.

Constraints:

- newPassword: if not empty, must match with confirmNewPassword; also checked against password-strength system validator
- ConfirmPassword: required only if invoked by non-root user

### Input

Input example for normal user:
```json
{
  "confirmNewPassword": "Nethesis,1234",
  "newPassword": "Nethesis,1234",
  "currentPassword": "TestPassword,1234"
}
```

Input example for root user:
```json
{
  "confirmNewPassword": "Nethesis,1234",
  "newPassword": "Nethesis,1234",
}
```

## update

Same input as vaidate.
