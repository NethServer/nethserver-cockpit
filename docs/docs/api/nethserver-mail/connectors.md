# connectors

Manage POP3/IMAP connectors (getmail).

## read

The read API requires an `action` field:

- `list`
- `check-credentials`

### Input 

#### list

Return the list of all configured connectors.

Input example:
```json
{
  "action": "list"
}
```

#### check-credentials

Check if given credentials are valid.

Input example:
```json
{
  "action": "check-credentials",
  "Retriever": "SimpleIMAPRetriever",
  "Server": "my.remotehost.com",
  "Password": "Nethesis,1234",
  "Username": "giacomo"
}
```

### Output

#### list

Return the list of all configured connectors gruped by destination.

Example:
```json
{
  "connectors": {
    "giacomo": [
      {
        "props": {
          "Server": "test.local.net",
          "Delete": "0",
          "Time": "30",
          "status": "enabled",
          "Account": "giacomo@local.neth.eu",
          "Password": "mypass",
          "Retriever": "SimpleIMAPSSLRetriever",
          "Username": "myuser",
          "type": "getmail",
          "FilterCheck": "enabled"
        },
        "name": "myaddr@remote.com",
        "type": "getmail"
      }
      ...
    ],
  }
}
```

#### check-credentials

Return a success message or a generic error.

Error output example:
```json
{
  "type": "GenericError",
  "message": "Operation timed out after 2001 milliseconds with 0 out of 0 bytes received"
}
```

## validate

The validate API requires an `action` field. Valid `actions` are:

- `update`
- `create`

Common constraints:

- Retriever: valid values are `SimplePOP3Retriever`, `SimplePOP3SSLRetriever`, `SimpleIMAPRetriever`, `SimpleIMAPSSLRetriever`
- Delete: number of days after the mail is deleted from the remote server, must be an integer grater or equal than `-1`. A negative number means 'never' 
- Time: time expressed in minutes, must be greater than 5
- Server: IP addres or host name
- status, SpamCheck, VirusCheck: can be `enabled` or `disabled`

Constraints for `update` action:

- name: must be a valid mail address and an already existing connector

Constraints for `create` action:

- name: must be a valid mail address and an non existing connector

### Input

#### update

Update an existing connector.

Example:
```json
{
  "Server": "my.remote.com",
  "Delete": "-1",
  "Time": "30",
  "status": "enabled",
  "Account": "admin@local.neth.eu",
  "Password": "Nethesis,1234",
  "Retriever": "SimpleIMAPRetriever",
  "Username": "giacomo",
  "FilterCheck": "enabled",
  "name": "external@my.remote.com",
  "action": "update"
}
```

#### create

Create a new connector.

Example:
```json
{
  "Server": "my.remote.com",
  "Delete": "-1",
  "Time": "30",
  "status": "enabled",
  "Account": "admin@local.neth.eu",
  "Password": "Nethesis,1234",
  "Retriever": "SimpleIMAPRetriever",
  "Username": "giacomo",
  "FilterCheck": "enabled",
  "name": "external@my.remote.com",
  "action": "create"
}
```

## create

Same input from validate API.

## update

Same input from validate API.

Extra valid actions:

- `enable`: enable and existing connector
- `disable`: disable an existing connector

Both `enable` and `disable` action return a standard event.

### Input

#### enable

Example:
```json
{
  "action": "enable",
  "name": "external@my.remote.com"
}
```

#### disable

Example:
```json
{
  "action": "disable",
  "name": "external@my.remote.com"
}
```

## delete

Delete the given connector.

Example:
```json
{
  "name": "external@my.remote.com"
}
```

## execute

Execute the getmail process and return the unit name to inspect the log.

Input example:
```json
{
  "name": "external@my.remote.com",
  "action": "run"
}
```

Output example:
```json
{
  "unit": "cockpit-getmail-external@my.remote.com"
}
```
