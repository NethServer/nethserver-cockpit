# ftp

Manage FTP configuration for vsftpd server.

## read

The read API requires an `action` field:

- `users`
- `configuration`

### Input 

#### users

Return the list of all configured users.

Input example:
```json
{
  "action": "users"
}
```

#### configuration

Return vsftpd server configuration.

Input example:
```json
{
  "action": "configuration"
}
```

### Output

#### users

Output example:
```json
{
  "users": [
    {
      "Password": "ftppass1",
      "ChrootDir": "/var/lib/nethserver/vhost/test1",
      "Chroot": "enabled",
      "name": "ftpu1",
      "Description": ""
    },
    ...
  ]
}
```

#### configuration

Output example:
```json
{
  "configuration": {
    "status": "disabled"
  }
}
```

## validate

The validate API requires an `action` field. Valid `actions` are:

- `configuration`
- `update`
- `create`

Constraint for action `configuration`:

- status: can be `enabled` or `disabled`

Constraint for action `create`:

- `name` must be a non-exiting FTP user
- Chroot: can be `enabled` or `disabled`

Constraint for action `update`:

- `name` must be an existing FTP user
- all other constratins from `create` action

### Input

#### configuration

Change server configuration.

Example:
```json
{
  "action": "configuration",
  "status": "enabled"
}
```

#### update

Update an existing user.

Example:
```json
{
  "action": "update",
  "Chroot": "enabled",
  "ChrootDir": "",
  "Password": "mypass",
  "Description": "my ftp user 1",
  "name": "ftpuser1"
}
```

#### create

Create a new user.

Example:
```json
{
  "action": "create",
  "Chroot": "enabled",
  "ChrootDir": "",
  "Password": "mypass",
  "Description": "my ftp user 1",
  "name": "ftpuser1"
}
```

## create

Same input from validate API.

## update

Same input from validate API.

Extra valid actions:

- `enable`: enable and existing user
- `disable`: disable an existing user

Both `enable` and `disable` action return a standard event.

### Input

#### enable

Example:
```json
{
  "action": "enable",
  "name": "ftpuser1"
}
```

#### disable

Example:
```json
{
  "action": "disable",
  "name": "ftpuser1"
}
```

## delete

Delete the given user.

Example:
```json
{
  "name": "ftpuser1"
}
```
