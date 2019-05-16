# configuration

Manage Suricata configuration and download categories.

## read

The read API takes an `action` field.

Valid actions are:

- `categories`
- `configuration`

### Input

#### categories

Return the list of downloaded categories.

Input example:
```json
{
  "action": "categories"
}
```

#### configuration

Return Suricata configuration.

Input example:
```json
{
  "action": "configuration"
}
```

### Output

#### categories

Output example:
```json
{
  "categories": [
    {
      "name": "ET-botcc",
      "Description": "Botcc"
    },
    {
      "name": "ET-emerging-policy",
      "Description": "Policy"
    },
    ...
  ]
}
```

#### configuration

Output example:
```json
{
  "BlockCategories": [
    {
      "name": "ET-emerging-dos",
      "Description": "Dos"
    }
  ],
  "status": "enabled",
  "AlertCategories": [
    {
      "name": "ET-emerging-activex",
      "Description": "Activex"
    },
    {
      "name": "ET-emerging-chat",
      "Description": "Chat"
    }
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
  "BlockCategories": ["cat1", "cat2", ...],
  "status": "enabled",
  "AlertCategories": []
}
```

## update

This API requires and `action` field.
Valid actions are:

- `configuration`: set the given configuration
- `download`: download Suricata categories

