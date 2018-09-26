# system-accounts-provider

Configures the system accounts provider. Supported use cases are:

- Local AD: configure, install, uninstall, change DC IP
- Remote AD: configure, bind, unbind
- Local LDAP: install, uninstall, upgrade to AD
- Remote LDAP: configure, bind, unbind

## read 

* Gathers information that helps to configure the system accounts provider
* Gives back the current system configuration

A JSON input object is mandatory with this schema:

```json
{
    "action": <action>
}
``` 



The allowed `action` values are described below.

### dump

Input:

```json
{
    "action": "dump"
}
```
Output:

```json
{
   "BindDN" : "",
   "LdapURI" : "ldap://127.0.0.1",
   "DiscoverDcType" : "dns",
   "StartTls" : "",
   "port" : 389,
   "host" : "127.0.0.1",
   "isAD" : "",
   "isLdap" : "",
   "UserDN" : "dc=edo,dc=nethesis,dc=it",
   "GroupDN" : "dc=edo,dc=nethesis,dc=it",
   "BindPassword" : "",
   "BaseDN" : "dc=edo,dc=nethesis,dc=it",
   "LdapUriDn" : "ldap:///dc%3Dedo%2Cdc%3Dnethesis%2Cdc%3Dit"
}
```

See `perldoc NethServer::SSSD` for attributes description.

### probeldap

Tries to contact a remote LDAP server and retrieve as much information as
possible with a root DSE query.

Input:

```json
{
    "action": "probeldap",
    "port": 389,
    "server": "remote.ldap.org"
}
```

* The `port` attribute is optional, can be entirely omitted or set to NULL

Output:

```json
{
   "BindDN" : "",
   "LdapURI" : "ldap://192.168.5.59",
   "DiscoverDcType" : "dns",
   "StartTls" : "1",
   "port" : 389,
   "host" : "192.168.5.59",
   "isAD" : "",
   "Provider" : "ldap",
   "isLdap" : "1",
   "UserDN" : "ou=People,dc=directory,dc=nh",
   "GroupDN" : "ou=Groups,dc=directory,dc=nh",
   "BindPassword" : "",
   "LdapUriDn" : "ldap:///dc%3Dedo%2Cdc%3Dnethesis%2Cdc%3Dit",
   "BaseDN" : "dc=directory,dc=nh"
}
```

* `StartTls` is a boolean condition that can be the empty string `""` (false) or
  non-empty string `"1"` (true).

### probead

Input:

```json
{
  "action": "probead",
  "realm": "adnethesis.it",
  "server": "192.168.5.59"
}
```

* The `server` attribute is optional, can be entirely omitted or set to NULL. If
  it has not been given, the action uses the system DNS to probe the AD configuration
* Ignore warnings and error messages sent to standard error, check the exit code only

Output:

```json
{
   "BindDN" : "user@adnethesis.it",
   "LdapURI" : "ldap://w2k12.adnethesis.it",
   "DiscoverDcType" : "dns",
   "StartTls" : "1",
   "port" : 389,
   "host" : "w2k12.adnethesis.it",
   "isAD" : "1",
   "isLdap" : "",
   "Provider" : "ad",
   "UserDN" : "DC=adnethesis,DC=it",
   "GroupDN" : "DC=adnethesis,DC=it",
   "Realm" : "ADNETHESIS.IT",
   "LdapUriDn" : "ldap:///dc%3Dadnethesis%2Cdc%3Dit",
   "BaseDN" : "DC=adnethesis,DC=it",
   "BindPassword" : "*****"
}
```

* `BindDN` and `BindPassword` fields are dummy values

### probeworkgroup

Suggest the best workgroup based on realm name.

Input:

```json
{
  "action": "probeworkgroup",
  "realm": "adnethesis.it",
}
```

Output:

```json
{
  "Workgroup": "AD"
}
```

## validate

### Constraints

The action must be specified inside the JSON `action` field.

Example:
```json
{
  "action": "remoteldap",
  ...
}
```

Valid actions:

- `remoteldap`

Constraints for `remoteldap`:

- StartTls: can be enabled or disabled
- Credentials are validate using ldap-credentials system validator

### Input


#### remoteldap

- `action` must be set to `remoteldap`

Example:
```json
{
  "BindDN": "cn=ldapservice,dc=directory,dc=nh",
  "LdapURI": "ldaps://192.168.1.1",
  "DiscoverDcType": "dns",
  "StartTls": "disabled",
  "Provider": "ldap",
  "UserDN": "ou=People,dc=directory,dc=nh",
  "GroupDN": "ou=Groups,dc=directory,dc=nh",
  "BindPassword": "xxxxxxxxxxxxxxxx",
  "BaseDN": "dc=directory,dc=nh",
  "action": "remoteldap"
}
```

`BindDN` and `BindPassword` password can be left empty if the bind is anonymous.

## update

It takes an `action` argument, supported actions are:

- `removeprovider`
- `localldap`

Input example:
```json
{
  "action": "removeprovider"
}
```

### localldap

Install local LDAP server.

It doesn't return progress of the operation but returns the underlying error if problem occurs.

Error example:
```json
{
  "type": "EventFailed",
  "id": 1535533242,
  "message": "[YumDownloadError] [u'Errors were encountered while downloading packages.', u'nethserver-directory-3.3.0-1.ns7.noarch: [Errno 256] No more mirrors to try.', u'openldap-servers-2.4.44-15.el7_5.x86_64: [Errno 256] No more mirrors to try.']\n"
}
```

### remoteldap

Configure all the properties for remote LDAP binding, then fire `nethserver-sssd-save` event.


### removeprovider

Remove the installed local account provider using `nethserver-sssd-remove-provider` to track the progress.

