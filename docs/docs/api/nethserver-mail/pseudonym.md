# pseudonym

Manage mail server psuedonyms.

## read

The read API requires an `action` field:

- `list`
- `destinations`

### Input 

#### list

Return the list of all configured and built-in aliases.

Input example:
```json
{
  "action": list"
}
```

#### destinations

Return the list of all destinations for the given alias.

Input example:
```json
{
  "action": "destinations",
  "name": "mydestination@nethserver.org",
  "type": "user"
}
```

### Output

#### list

Return the list of all aliases.

Output example:
```json
{
  "pseudonyms": [
    {
      "builtin": 1,
      "props": {
        "Account": [
          {
            "name": "user1@nethesis.it",
            "displayname": "user1",
            "type": "user"
          }
        ],
        "Description": "",
        "Access": "public"
      },
      "name": "matteo@nethesis.it",
      "type": "user",
      "wildcard": 0
    },
    {
      "builtin": 0,
      "props": {
        "Account": [
          {
            "name": "external@test.org",
            "type": "external"
          },
          {
            "name": "mygroup",
            "type": "group"
          },
          {
            "name": "shared1",
            "type": "public"
          }
        ],
        "type": "pseudonym",
        "Description": "",
        "Access": "public"
      },
      "name": "abuse@",
      "type": "pseudonym",
      "wildcard": 1
    },
    ...
  ]
}
```

#### destinations

Return the list of all destinations for the given alias.

Output example:
```json
{
  "destinations": [
     "test1@nethserver.org",
     ...
  ]
}
```

## validate

The validate API requires an `action` field:

- `create-pseudonym`
- `update-pseudonym`
- `update-builtin`

Constraints for `create-pseudonym` action:

- name: must be a non-existing pseudonym inside the `accounts` database and not reserved for builtin
- domains: can be empty, otherwise every listed domain must already exists inside the `domains` database
- Account: must be a list of users, shared mailboxes, groups or extrenal addresses
- Access: can be `public` or `private`

Constraints for `update-pseudonym` action:

- name: must be an existing pseudonym inside the `accounts` database
- Account: must be a list of users, shared mailboxes, groups or extrenal addresses
- Access: can be `public` or `private`

Constraints for `update-builtin` action:

- MailAccess: can be `public` or `private`

### Input

#### create-pseudonym

Create the pseudonym specified inside the `name` field.
If `domains` is empty, it creates a wildcard alias, otherwise it creates
a pseudonym record for each given domain.

Example:
```json
{
  "action": "create-pseudonym",
  "domains": [],
  "Description": "my desc",
  "Access": "public",
  "Account": [
    {
      "name": "giacomo@my.domain.loc",
      "type": "user"
    }
  ],
  "name": "info"
}
```

#### update-pseudonym

Update the pseudonym specified inside the `name` field.

Example:
```json
{
  "action": "update-pseudonym",
  "Description": "my desc",
  "Access": "public",
  "Account": [
    {
      "name": "giacomo@my.domain.loc",
      "type": "user"
    }
  ],
  "name": "info"
}
```

#### update-builtin

Update the builtin pseudonym specified inside the `name` field.

Example:
```json
{
  "action": "update-builtin",
  "Access": "public",
  "name": "info"
}
```


## create

Same input for validate API.


## update

Same input for validate API.


## delete

Delete the pseudonym given in the `name` field.

Input example:
```json
{
  "name": "info@"
}
```
