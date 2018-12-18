# system-subscription

Manage server subscription on a [Dartagnan](https://nethesis.github.io/dartagnan/) server.

## read

### Output

The `configuration` field contains the `subscription` record.
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
    "props": {
      "InventoryUrl": "https://my.nethserver.com/api/machine/inventories/store/",
      "AlertsAutoUpdates": "enabled",
      "ApiUrl": "https://my.nethserver.com/api/",
      "PricingUrl": "https://my.nethserver.com/?action=newServer",
      "AlertsUrl": "https://my.nethserver.com/api/machine/",
      "SystemId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "NsRelease": "7.6.1810",
      "Secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    "name": "subscription",
    "type": "configuration"
  }
}
```

## validate

### Constraints

- Secret must be a valid secret, it's validated against the remote server

### Input

```json
{
  "Secret": "75f99f440450a89a75fb5c9ebae7457f47bd42bc5cb940b4e142b50a5bb9cbae"
}
```

## update

Same input from validate helper.
