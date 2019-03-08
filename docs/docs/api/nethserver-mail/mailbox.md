# mailbox

Manage mail server destinations like user and shared mailboxes.

## read

The read API requires an `action` field:

- `list`
- `aliases`

### Input 

#### list

Return the list of all configured destinations.

Input example:
```json
{
  "action": "list",
  "expand": 1
}
```

#### aliases

Return the list of all aliases for the given destination.

Input example:
```json
{
  "action": "aliases",
  "name": "mydestination@nethserver.org",
  "type": "user"
}
```

### Output

#### list

Return the list of all destinations with current quota.

If `expand` is set to 1, the list will contains all extra info, 
like quota, acls, etc.
If `expand` is set to 0, return only the list with name and type,
useful for form usage inside the UI.

Output example with `expand` set to 0:
```json
{
  "builtin": [
    {
      "name": "root",
      "type": "bultin",
      "displayname": "root",
    }
  ],
  "public": [
    {
      "name": "share1",
      "displayname": "share1",
      "type": "public"
    },
    ...
  ],
  "groups": [
    {
      "name": "g1@nethserver.org",
      "displayname": "g1",
      "type": "group"
    },
    ...
  ],
  "users": [
    {
      "name": "user1@nethserver.org",
      "type": "user",
      "displayname": "user1"
    },
    ...
  ]
}
```


Output example with `expand` set to 1:
```json
{
  "builtin": [
    {
      "name": "root",
      "type": "bultin",
      "displayname": "root"
    }
  ],
  "public": [
    {
      "acls": [
        {
          "right": "custom",
          "global": "",
          "rawrights": "expunge read",
          "name": "giacomo@local.neth.eu",
          "displayname": "giacomo",
          "type": "user",
          "id": "user=giacomo@local.neth.eu"
        }
      ],
      "name": "public4",
      "displayname": "public4",
      "type": "public"
    },
    {
      "acls": [
        {
          "right": "read-write",
          "global": "",
          "rawrights": "create insert lookup read write write-deleted write-seen",
          "name": "giacomo@local.neth.eu",
          "displayname": "giacomo",
          "type": "user",
          "id": "user=giacomo@local.neth.eu"
        }
      ],
      "name": "public2",
      "displayname": "public2",
      "type": "public"
    },
    ...
  ],
  "groups": [
    {
      {
        "props": {
          "MailStatus": "enabled"
        },
        "name": "mygroup@nethserver.org",
        "type": "group",
        "displayname": "mygroup"
      },
    ...
  ],
  "users": [
    {
      "quota": {
        "maximum": 20971520,
        "messages": 58501,
        "percentage": 5,
        "size": 1126126
      },
      "connectors": [
        {
          "props": {
            "Server": "1.2.3.4",
            "Delete": "0",
            "Time": "30",
            "status": "enabled",
            "Password": "test",
            "Retriever": "SimplePOP3Retriever",
            "Username": "test",
            "type": "getmail",
            "FilterCheck": "enabled"
          },
          "name": "a@a.com",
          "type": "getmail"
        }
      ],
      "props": {
        "MailForwardAddress": "",
        "EmailAddress": "",
        "MailSpamRetentionStatus": "disabled",
        "MailQuotaCustom": "15",
        "MailForwardKeepMessageCopy": "no",
        "Phone": "",
        "MailQuotaType": "default",
        "MailAccess": "public",
        "MailForwardStatus": "disabled",
        "Dept": "",
        "MailSpamRetentionTime": "15d",
        "type": "user",
        "MailStatus": "enabled"
      },
      "name": "myuser@nethserver.org",
      "type": "user",
      "displayname": "myuser"
    },
    {
      "props": {
        "MailStatus": "enabled"
      },
      "name": "redmine@nethserver.org",
      "type": "group",
      "displayname": "redmine"
    },
    ...
  ]
}
```

#### aliases

Return the list of all aliases for the given destination.

Output example:
```json
{
  "aliases": [
    "abuse@nethesis.it",
    "abuse@nethserver.com",
    "abuse@nethserver.org",
    "abuse@nethspot.com",
    "myuser@nethserver.org",
     ...
  ]
}
```

## validate

The validate API requires an `action` field. Valid `actions` are:

- `configuration`
- `update-group`
- `update-user`
- `create-public`
- `update-public`

Constraints for `configuration` action:

- DeletedToTrash, LogActions, DynamicGroupAlias, PopStatus, QuotaStatus, MaxUserConnectionsPerIp, AdminIsMaster, ImapStatus, TlsSecurity, SpamFolder: can be `enabled` or `disabled`
- SpamRetentionTime: a number representing days between -1 and 365, if set to -1 the retention is disabled
- QuotaDefaultSize, MaxUserConnectionsPerIp: positive integer

Constraints for `update-group` action:

- MailStatus: can be `enabled` or `disabled`

Constraints for `update-user` action:

- MailForwardStatus, MailStatus: can be `enabled` or `disabled`
- MailForwardKeepMessageCopy: can be `yes` or `no`
- MailSpamRetentionTime: a number representing days between -1 and 365, if set to -1 the retention is disabled
- MailQuotaType: can be `default` or `custom`
- MailQuotaCustom: positive integer
- MailForwardAddress: an array of valid mail addresses or empty

Constraints for `create-public` action:

- name: name for non existing public folder
- rights: valid values are `read`, `read-write`, `full`

Constraints for `update-public` action:

- name: name of an existing public folder
- rights: valid values are `read`, `read-write`, `full`

### Input

#### configuration

Update general configuration.

Example:
```json
{
  "DeletedToTrash": "disabled",
  "LogActions": "disabled",
  "SpamRetentionTime": "60",
  "DynamicGroupAlias": "enabled",
  "TlsSecurity": "enabled",
  "PopStatus": "enabled",
  "SpamFolder": "enabled",
  "QuotaStatus": "enabled",
  "QuotaDefaultSize": "20",
  "MaxUserConnectionsPerIp": "12",
  "AdminIsMaster": "disabled",
  "ImapStatus": "enabled",
  "action": "configuration"
}
```

#### update-group

Update group mailbox.

Example:
```json
{
  "MailStatus": "enabled",
  "name": "g1@local.neth.eu",
  "action": "update-group"
}
```

#### update-user

Update user mailbox.

Example:
```json
{
  "MailForwardAddress": [],
  "MailSpamRetentionStatus": "disabled",
  "MailQuotaCustom": "20",
  "MailForwardKeepMessageCopy": "no",
  "MailQuotaType": "default",
  "MailForwardStatus": "disabled",
  "MailSpamRetentionTime": "60",
  "MailStatus": "enabled",
  "name": "giacomo@local.neth.eu",
  "action": "update-user"
}
```

#### create-public

Create a public mailbox.

Example:
```json
{
  "action": "create-public",
  "acls": [
    {
      "name": "giacomo@local.neth.eu",
      "type": "user",
      "right": "read"
    }
  ],
  "name": "public1"
}
```


#### update-public

Update an existing public mailbox.
If `newname` field is set, also rename the public folder.

Example:
```json
{
  "action": "create-public",
  "acls": [
    {
      "name": "giacomo@local.neth.eu",
      "type": "user",
      "right": "read-write"
    }
  ],
  "name": "public1",
  "newname": "public2"
}
```

## update

Same input from validate API.

Valid actions:

- `configuration`
- `update-group`
- `update-user`
- `update-public`

## create

Same input from validate API, valid only for public folder creation.

Valid actions:

- `create-public`

## delete

Delete the given public mailbox.

Example:
```json
{
  "name": "public1"
}
```
