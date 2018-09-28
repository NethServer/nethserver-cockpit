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
- `localad`
- `remotead`

Constraints for `remoteldap`:

- StartTls: can be enabled or disabled
- Credentials are validate using ldap-credentials system validator

Constraints for `localad`:

- Realm: must be a FQDN, validated using also dcrealm system validator
- IpAddress: a valid free IP address, validated using also dcipaddr system validator
- Workgroup: a simple hostname, maximum 15 chars


Constraints for `remotead`:

- AdDns: must be a valid IP address or empty, checked also using ad-dns system validator
- AdRealm: must be a FQDN, checked also using ad-dns system validator
- AdUsername and AdPassword: not empty, check if credentials are valid

### Input


#### remoteldap

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

#### localad

Input example:
```json
{
  "action": "localad",
  "Realm": "ad.local.neth.eu",
  "Workgroup": "LOCAL",
  "IpAddress": "192.168.5.35"
}
```

#### remotead

Input example:
```json
{
  "action": "remotead",
  "AdRealm": "adnethserver.org",
  "AdDns": "192.168.1.1",
  "AdUsername": "administrator@adnethserver.org",
  "AdPassword": "mypassword"
}
```


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

Return the output of `pkgaction` in json format.
Output example:
```json
{"message": "Initialization", "state": "running"}
{"message": "Resolving RPM dependencies", "state": "running"}
{"message": "Downloading Packages", "state": "running"}
{"message": "Download RPMs", "state": "running"}
{"message": "Downloading - nethserver-net-snmp-1.1.0-1.ns7.noarch.rpm", "state": "running"}
...
{"message": "Check Package Signatures", "state": "running"}
{"message": "Running Test Transaction", "state": "running"}
{"message": "Running Transaction", "state": "running"}
{"message": "Installing nethserver-net-snmp-1.1.0-1.ns7.noarch", "state": "running"}
...
{"message": "Transaction end", "exit": 0, "state": "end"}
```

Error example:
```json
{"message": "Initialization", "state": "running"}
{"message": "Resolving RPM dependencies", "state": "running"}
{"message": "Downloading Packages", "state": "running"}
{"action": "Downloading - nethserver-net-snmp-1.1.0-1.ns7.noarch.rpm", "state": "running"}
...
{"action": "[YumDownloadError] [u'Errors were encountered while downloading packages.', u'nethserver-net-snmp-1.1.0-1.ns7.noarch: [Errno 256] No more mirrors to try.']", "state": "end", "exit": 1}
```

### remoteldap

Configure all the properties for remote LDAP binding, then fire `nethserver-sssd-save` event.

### removeprovider

Remove the installed local account provider using `nethserver-sssd-remove-provider` to track the progress.

### localad

Install nethserver-dc, it uses the same input from validate.
Return the output of `pkgaction` in json format.

### remotead

Try to join the domain, if the join fails, rollback to previous state.

Output the state of all executed events and of netherver-dc package installation (see localldap for the output).
