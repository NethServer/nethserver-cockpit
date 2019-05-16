# system-subscription

Manage server subscription on a [Dartagnan](https://nethesis.github.io/dartagnan/) server.
Also start and stop windmill remote support client (don).

## read

### Output

The `configuration` field contains info about the subscription.
If the server is already registered, the `status` field contains all info retrieved from `subscription-info` script.

Output example:
```json
{
  "status": {
    "id": 587,
    "creator_id": "github|aaaaa",
    "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "secret": "",
    "tags": "trial",
    "public_ip": "1.2.3.4",
    "status": "active",
    "created": "2018-12-18T17:16:36.760373Z",
    "notification": {
      "emails": [
        "myuser@my.nethserver.com"
      ]
    },
    "hostname": "",
    "alerts": 0,
    "subscription": {
      "id": 587,
      "user_id": "github|aaaaaa",
      "status": "valid",
      "valid_from": "2018-12-18T17:16:36.760373Z",
      "valid_until": "2019-01-17T17:16:36.760373Z",
      "created": "2018-12-18T17:16:36.760374Z",
      "subscription_plan": {
        "id": 1,
        "code": "trial",
        "name": "Trial Pizza",
        "description": "30 Day Trial",
        "price": 0,
        "period": 30
      }
    }
  },
  "configuration": {
    "PricingUrl": "https://my.nethserver.com/?action=newServer",
    "SystemId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "PortalURL": "https://my.nethserver.com",
    "enterprise": 0
  },
  "support": {
    "status": "enabled",
    "server": "sos.nethesis.it",
    "sessionid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

## validate

### Constraints

- Secret must be a valid secret, it's validated against the remote server

### Input

Example:
```json
{
  "action": register,
  "Secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## update

Each request must have an `action` field.
Available actions:

- `register`: register the server to the Dartagnan server
- `send`: send inventory to the Dartagnan server
- `support-start`: start don support
- `support-stop`: stop don support

### Input

#### register

Example:
```json
{
  "action": "register",
  "Secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### send

Example:
```json
{
  "action": "send"
}
```
