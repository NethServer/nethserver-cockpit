# domains

Configure email domains

## read

The read API accepts an `action` field.

- `list-domains`, default if `action` is not provided
- `network-checks`

### Input

#### list-domains

Query the current email domains configuration

Example:
```json
{
  "action": "list-domains"
}
```

#### network-checks

Runs remote network checks for the given `domain` attribute (mandatory),
invoking public DNS servers and the **ifconfig.co** website.

Example:
```json
{
  "action": "network-checks",
  "domain": "example.com"
}
```

### Output

#### list-domains

The `list-domains` action returns a rich description of the email domains
configuration.

Example:
```json
{
  "dkimTxtRecord": "...",
  "dkimRawData": "...",
  "isServerAvailable": true,
  "isDisclaimerAvailable": true,
  "defaultRecipientMailbox": {
    "name": "root",
    "type": "builtin"
  },
  "domains": [
    {
      "UnknownRecipientsActionDeliverMailbox": "root",
      "name": "dpnet.nethesis.it",
      "TransportType": "LocalDelivery",
      "unknownRecipientMailbox": {
        "name": "root",
        "type": "builtin"
      },
      "DisclaimerText": "",
      "OpenDkimStatus": "enabled",
      "AlwaysBccStatus": "disabled",
      "DisclaimerStatus": "disabled",
      "RelayHost": "1.2.3.4",
      "isPrimaryDomain": true,
      "type": "domain",
      "AlwaysBccAddress": "",
      "Description": "",
      "UnknownRecipientsActionType": "deliver"
    }
  ]
}
```

#### network-checks

If the input is not correct the output `status` attribute is `error`.

Other output attributes correspond to specific remote network checks. Each
entry has always the following attributes:

* `status` represents the remote _call status_ that can be either `success`
  or `failure`. A failed status indicates some kind of error has occurred. The
  error is detailed by `response` and `message` contents
* `response`: if the _call status_ is `success` it represents the _check status_. 
  If the check was successful the `response` value must be `ok`, otherwise a 
  check-specific error string is set, indicating the error reason
* `message` is an additional information for the response, always set for 
  `exit-code` and `internal-error` responses. See also the table below

This is a table of possible response values with `message` meaning between
parenthesis where relevant:

| check name | success  | failure |
| --- | ---- | --- |
| port-25  | ok, unreachable  | exit-code, internal-error |
| dkim-record  | ok, missing, mismatch | exit-code, internal-error |
| mx-record  | ok(MX value), missing, mxbad(MX value) |  exit-code, internal-error |
| iprev-check  |  ok, iprevbad | exit-code, internal-error, precondition-failed |


Example:
```json
{
  "port-25": {
    "response": "unreachable",
    "status": "success",
    "message": ""
  },
  "dkim-record": {
    "response": "mismatch",
    "status": "success",
    "message": ""
  },
  "mx-record": {
    "response": "ok",
    "status": "success",
    "message": "nethservice.nethesis.it"
  },
  "status": "success",
  "iprev-check": {
    "response": "ok",
    "status": "success",
    "message": ""
  }
}
```



## validate

The validate API requires and `action` and a `domain` field.
Valid actions are:

- `create`
- `delete`
- `edit`
- `edit-dkim`

The `domain` field contains the data to validate.

### Constraints

Calculated `domain` fields:

* `name` is the domain name and unique identifier
* `unknownRecipientMailbox` is an object representing a Mailbox
* `DisclaimerText` free text, max length 2048

`domain` fields directly mapped to DB props:

* `DisclaimerStatus => {enabled,disabled}`
* `TransportType => {Relay,LocalDelivery}`
* `RelayHost => host name or IP address` (if `TransportType` is `Relay`)
* `Description => free text`
* `AlwaysBccStatus => {enabled,disabled}`
* `AlwaysBccAddress => email address` (if `AlwaysBccStatus` is `enabled`)
* `UnknownRecipientsActionType => {delivery,bounce}`
* `OpenDkimStatus => {enabled,disabled}`

Unrecognized fields are ignored.

### Input

#### create

The domain must not exist.

```json
{
  "action": "create",
  "domain": {
    "DisclaimerStatus": "disabled",
    "TransportType": "Relay",
    "RelayHost": "",
    "name": "new.tld",
    "Description": "",
    "AlwaysBccStatus": "disabled",
    "AlwaysBccAddress": "",
    "UnknownRecipientsActionType": "bounce",
    "DisclaimerText": "",
    "unknownRecipientMailbox": {
      "name": "root",
      "type": "builtin"
    }
  }
}
```

#### delete

The domain must exist.

```json
{
  "action": "delete",
  "domain": ...
}
```

#### edit

The domain must exist.

```json
{
  "action": "edit",
  "domain": ...
}
```

#### edit-dkim

The domain must exist.

```json
{
  "action": "edit-dkim",
  "domain": {
    "name": "dpnet.nethesis.it",
    "OpenDkimStatus": "disabled"
  }
}
```


## update

See the validate input format.
