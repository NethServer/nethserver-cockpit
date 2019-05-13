# configuration

Manage Suricata configuration and download categories.

## read

The read API takes an `action` field.

Valid actions are:

- `configuration`
- `default-categories`

Input example:
```json
{
  "action": "configuration":
}
```


### Output

#### configuration

List the status of IPS engine (suricata) and all categories.
Each category has a `status` field. Possible status are:

- `disable`
- `block`
- `alert`

Output example:
```json
{
  "status": "enabled",
  "categories": [
    {
      "status": "block",
      "name": "ET-emerging-web_client",
      "Source": "Emerging Threats",
      "Description": "Web client"
    },
    {
      "status": "disable",
      "name": "ET-emerging-web_server",
      "Source": "Emerging Threats",
      "Description": "Web server"
    },
    {
      "status": "alert",
      "name": "ET-emerging-web_specific_apps",
      "Source": "Emerging Threats",
      "Description": "Web specific apps"
    },
    ...
  ]
}
```

#### default-categories

Return a list of safe categories enabled by default.

Output example:
```json
{
  "categories": [
    {
      "status": "block",
      "name": "ET-botcc",
      "Source": "Emerging Threats",
      "Description": "Botcc"
    },
    {
      "status": "disable",
      "name": "ET-emerging-chat",
      "Source": "Emerging Threats",
      "Description": "Chat"
    },
    {
      "status": "alert",
      "name": "ET-emerging-current_events",
      "Source": "Emerging Threats",
      "Description": "Current events"
    },
    ...
  ]
}

```

## validate

Validate suricata configuration.

Constraints:

- status: can be `enabled` or `disabled`
- BlockCategories, AlertCategories: an array of category ids, the category must already be downloaded

### Input

#### configuration

Input example:
```json
{
  "action": "configuration",
  "status": "enabled",
  "categories": [
    {
      "status": "block",
      "name": "ET-emerging-web_client",
      "Source": "Emerging Threats",
      "Description": "Web client"
    },
    {
      "status": "disable",
      "name": "ET-emerging-web_server",
      "Source": "Emerging Threats",
      "Description": "Web server"
    },
    {
      "status": "alert",
      "name": "ET-emerging-web_specific_apps",
      "Source": "Emerging Threats",
      "Description": "Web specific apps"
    },
    ...
  ]
}
```

## update

This API requires and `action` field.
Valid actions are:

- `configuration`: set the given configuration
- `download`: download Suricata categories

