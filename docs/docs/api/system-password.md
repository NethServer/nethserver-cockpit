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

Implements the self password change. It handles two use cases:

* change local root's password with `passwd`
* change user's password in the accounts provider DB (both local and remote)

The latter checks if a user kerberos ticket is available. If so it assumes an AD
accounts provider is configured and runs the `kpasswd` command.

Otherwise it attempts to connect the LDAP server configured in
/etc/nethserver/ldappasswd.conf and runs the ldappasswd command with the user's
credentials. The LDAP BIND operation uses a DN in the following default form:

    uid=<short username>,<user DN branch suffix>

For instance

    uid=davidep,ou=People,dc=directory,dc=nh

The DN can be overridden with the environment variable LDAPBINDDN. The default
form suits ns6 and ns7 configuration.

Remote LDAP providers are always connected with STARTTLS or LDAPS. See the
Perl `NethServer::SSSD::startTls` method for details.

### Input

See the `validate` helper.

### Output

A simple `success` message, or specific Error codes.
