# sharedfolders

Manage shared folder objects: create, edit, delete

## read

The `read` API requires an `action` field. Possible values are as defined as
following:

- `list`, returns the list of shared folders and their configuration
- `list-users`, returns the list of system users

The API objects structure does not change with the accounts provider type.
However some fields can be ignored, as noted below.

### Output

#### list

The `list` output format is similar to

```json
{
  "accountsProvider": "ldap",
  "groups": [
    "domain admins@dpnet.nethesis.it"
  ],
  "sharedfolders": [
    {
      "SmbRecycleBinStatus": "disabled",
      "SmbAuditStatus": "disabled",
      "SmbShareBrowseable": "enabled",
      "guestAccess": "enabled",
      "name": "iba2",
      "OwningGroup": "",
      "SmbRecycleBinVersionsStatus": "disabled",
      "acls": {
        "EVERYONE": "rw"
      },
      "Description": "",
      "migrateVhost": null
    }
  ]
}
```

* `sharedfolders` is an array of objects describing each folder configuration. 
  See the `validate` format for more information.

* `accountsProvider` is a string indicating the accounts provider type. It can be
  `ad`, `none` or `ldap`.

* `groups` is an array of system group names.

#### list-users

The `list-users` returns an array of system user names, in the following format:

```json
{
  "users": [
    "admin@dpnet.nethesis.it"
  ]
}
```

## validate

### Input


Input example:

```json
{
  "action": "create",
  "item": {
    "SmbRecycleBinStatus": "disabled",
    "SmbRecycleBinVersionStatus": "disabled",
    "SmbAuditStatus": "enabled",
    "SmbShareBrowseable": "enabled",
    "guestAccess": "enabled",
    "name": "iba1",
    "OwningGroup": "domain admins@example.com",
    "acls": {
      "GOWNER": "rw",
      "EVERYONE": "r"
    },
    "Description": "This is the first shared folder example",
    "SmbRecycleBinVersionsStatus": "disabled",
    "migrateVhost": null
  }
}

```

- `action` can be `create` or any other string. If set to `create` the
  the given item is expected to not exist. On the contrary, for any other value the 
  `item.name` must identify an existing item.

- `item` describes the shared folder configuration:

  - `name` is the shared folder name. It must be unique and non existing.

  - `SmbRecycleBinStatus`, `SmbRecycleBinVersionStatus`, `SmbAuditStatus`,
    `SmbShareBrowseable`, `SmbRecycleBinVersionsStatus` 
    can be `enabled` or `disabled`.
    See the `nethserver-samba` accounts DB documentation for their meaning

  - `OwningGroup` (required by AD) is the proprietary unix group

  - `acls` is an object describing the filesystem ACLs set on the shared folder root 
    directory.
    
    The object key must be a valid system group or user name. The object value can be 
    the empty string, `r`, or `rw`.
    
    `EVERYONE` and `GOWNER` are special values, which are mapped to the underlying 
    Esmith DB props.

  - `migrateVhost` is normally `null`. If set to a string it indicates that the shared folder should
    be migrated to a virtual host (provided by nethserver-httpd), identified by the string itself.



## update

The `update` API scripts has this generic input form:

```json
{
    "action": "...",
    "item": { ... }
}
```

The following sections document available `action` values.

### edit

Changes an existing shared folder configuration. Updates the corresponding
e-smith  accounts DB props and invokes the `ibay-modify` event. See the
`validate` script, for more information about the `item` object format.

```json
{
    "action": "edit",
    "item": {
        "name": "the_record_key"
        // other attributes
    }
}
```

### reset-permissions

Invokes the `ibay-reset-permissions` event on an existing shared folder.

```json
{
    "action": "reset-permissions",
    "item": {
        "name": "the_record_key"
    }
}
```

### migrate

Invokes the `vhost-migrate-ibay` event on an existing shared folder. The shared
folder must have some configuration props set by the NS6 nethserver-ibay module.


```json
{
    "action": "migrate",
    "item": {
        "name": "the_record_key"
    }
}
```



## create

Creates a new shared folder. Set e-smith accounts DB and invokes the
`ibay-create` event.

```json
{
    "action": "create",
    "item": {
        // ...
    }
}
```

The `item` object format is the same used by the `edit` action in the `update`
script.

### delete

Deletes an existing shared folder. Changes the e-smith record type and invokes
the `ibay-delete` event. It finally removes the e-smith DB record.

```json
{
    "action": "delete",
    "item": {
        "name": "the_record_key"
    }
}
```
