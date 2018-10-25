# system-users

Manage users and groups.
Access to remote account providers is provided in read-only mode.

## read

### Input

Available actions are:

- `list-users`
- `list-groups`
- `user-membership`
- `group-members`

#### list-users

Example:
```json
{
  "action": "list-users"
}
```

#### list-groups

Example:
```json
{
  "action": "list-groups"
}
```

#### user-membership

The `user` field is the username.

Example:
```json
{
  "action": "user-membership",
  "user": "user"
}
```

#### group-members

The `group` fiels is the name of the group.

Example:
```json
{
  "action": "group-members",
  "group": "group1"
}
```

### Output

#### list-users

Return the list of users.
The `groups` field is always empty.

Example:
```json
{
  "admin": {
    "locked": 1,
    "gecos": "admin",
    "expired": 0,
    "groups": [],
    "shell": "/usr/libexec/openssh/sftp-server",
    "new": 1,
    "expires": "no"
  },
  "giacomo": {
    "locked": 0,
    "gecos": "Test User",
    "expired": 0,
    "groups": [],
    "shell": "/bin/bash",
    "new": 0,
    "expires": "yes"
  }
  ...
}

```

#### list-groups

Return the list of groups.
The `members` field is always empty.

Example:
```json
{
  "administrators": {
    "members": []
  },
  "g1": {
    "members": []
  }
  ...
}

```

#### user-membership

Return the list of groups belonging to the user.

Example:
```json
[
  "group1",
  ...
]
```

#### group-members

Return the list of users inside a group.

Example:
```json
[
  "user1"
]
```

## validate

Validate user and group CRUD operations.
Each validator takes and `action` argument.

Valid actions are:

- `user-create`
- `user-update`
- `user-delete`
- `change-password`
- `group-create`
- `group-update`
- `group-delete`

### Constraints

#### Users

Action `user-create`:

- name: a valid Unix user name
- groups: empty or a list of existing groups
- gecos: name and surname
- expires: can be `yes` or `no`
- shell: can be /bin/bash' or '/usr/libexec/openssh/sftp-server`
- newPassword: if not empty, must match with confirmNewPassword; also checked agains password-strength system validator

Action `user-update`:

- name: an existing user
- groups: empty or a list of existing groups
- gecos: name and surname
- expires: can be `yes` or `no`
- shell: can be /bin/bash' or '/usr/libexec/openssh/sftp-server`

Action `user-delete`:

- name: check if the user can be deleted using user-delete system validator

Action `change-password`:

- name: an existing user
- newPassword: if not empty, must match with confirmNewPassword; also checked against password-strength system validator

#### Groups

Action `group-create`:

- name: a valid Unix user name
- members: empty or a list of existing users

Action `group-update`:

- name: an existing group
- members: empty or a list of existing users

Action `group-delete`:

- name: check if the user can be deleted using group-delete system validator


### Input

#### user-create

Example:
```json
{
  "action": "user-create",
  "name": "user1",
  "groups": [],
  "gecos": "First User",
  "expires": "no",
  "shell": "/bin/bash",
  "newPassword": "Nethesis,1234",
  "confirmNewPassword": "Nethesis,1234"
}
```

#### user-update

Example:
```json
{
  "action": "user-update",
  "name": "user1",
  "groups": ["group1", "group2"],
  "gecos": "First User",
  "expires": "no",
  "shell": "/usr/libexec/openssh/sftp-server"
}
```

#### user-delete

Example:
```json
{
  "action": "user-delete",
  "name": "user1"
}
```

#### change-password

Example:
```json
{
  "action": "change-password",
  "newPassword": "Nethesis,1234",
  "confirmNewPassword": "Nethesis,1234",
  "name": "user1"
}
```


#### group-create

Example:
```json
{
  "action": "group-create",
  "name": "group2",
  "members": ["user1"]
}
```

#### group-update

Example:
```json
{
  "action": "group-updte",
  "name": "group2",
  "members": ["user1", "user2"]
}
```

#### group-delete

Example:
```json
{
  "action": "group-delete",
  "name": "root"
}
```


## update

Use the same input from validate.

Besides actions implemented inside the validate, there is also an action called `toggle-lock`.

### toggle-lock

If the user is locked, unlock it.
If the user is unlocked, lock it.

Input example:
```json
{
  "action": "toggle-lock",
  "name": "user2"
}
```

## create

Use the same input from validate.

## delete

Use the same input from validate.
