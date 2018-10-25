# system-password

Change password of the logged user.

This API should not be invoked using `sudo`.

## update

Required fields:

- NewPassword and ConfirmPassword: values must be the same and should comply with the password policy
- ConfirmPassword: required only if invoked by non-root user

### Input

Input example for normal user:
```json
{
  "ConfirmPassword": "Nethesis,1234",
  "NewPassword": "Nethesis,1234",
  "CurrentPassword": "TestPassword,1234"
}
```

Input example for root user:
```json
{
  "ConfirmPassword": "Nethesis,1234",
  "NewPassword": "Nethesis,1234",
}
```
