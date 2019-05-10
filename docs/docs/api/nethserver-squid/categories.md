# categories

Manage filter categories and categories sources.

## read

The read API takes an `action` field.

Valid actions are:

- `categories`
- `configuration`
- `lists`

### Input

#### categories

Return the list of downloaded categories plus the custom ones.
If `filter` is set, it returns only the selected category type.
Valid values are `custom` and `downloaded`. 

Input example:
```json
{
  "action": "categories",
  "filter": "custom"
}
```

#### configuration

Return configured list.
If `Lists` is set to `custom', `CustomListUrl` should contain an HTTP url.

Input example:
```json
{
  "action": "configuration"
}
```

#### lists

Return the list of supported list sources.

Input example:
```json
{
  "action": "lists"
}
```

### Output

#### categories

The `domains` field is always empty for category of `downloaded` type to avoid
transfer of too much data.
The `profiles` field contains the list of profiles where the category is used.

Output example:
```json
{
  "categories": {
    [
      {
        "type": "downloaded",
        "name": "cryptojacking",
        "domains": [],
        "description": "Mining site by hijacking",
        "info": "cryptojacking"
        "profiles": ["p1"],
      },
      {
        "name": "custom1",
        "info": "",
        "description": "custom desc 1",
        "type": "custom",
        "domains": [
          "nethesis.it"
        ],
        "profiles": [],
      },
      ...
    ]
  },
  "source": {
      "downloaded": true,
      "list": "toulouse"
  }
}
```

#### configuration

Output example:
```json
{
  "configuration": {
    "Lists": "toulouse",
    "CustomListURL": "",
    "profiles": [
      "p1"
    ]
  }
}
```

#### lists

Output example:
```json
{
  "lists": [
    "toulouse",
    "shalla",
    "mesd",
    "custom"
  ]
}
```

## validate

Valid actions are:

- `configuration`
- `create-category`
- `update-category`

### Constraints

Constraints for `configuration` action:

- List: mut have one of the following values: `toulouse`, `shalla`, `mesd`, `custom`

Constraints for `update-category` action:

- the category name must already exists

Constraints for `create-category` action:

- the category name must not already exists

### Input

#### configuration

Set source list name or url and download the categories using `nethserver-squidguard-downloadlists` event.
`CustomListURL` should have a value only if `Lists` is set to `custom`.

Input example:
```json
{
  "action": "configuration",
  "Lists": "shalla",
  "CustomListURL": ""
}
```

#### create-category

Create a custom category.

Input example:
```json
{
  "action": "create-category",
  "Description": "custom2 desc",
  "name": "custom2",
  "Domains": [
    "domain1.org",
    "domain2.org"
  ]
}
```

#### update-category

Update and existing custom category.

Input example:
```json
{
  "action": "update-category",
  "name": "custom2",
  "Domains": [
    "domain1.org",
    "domain3.org"
  ],
  "Description": "custom2 desc2"
}
```

## create

Same input from validate helper.

## update

Same input from validate helper.

Extra valid actions:

- `download`: download categories

## delete

Delete the given record.

Input example:
```json
{
  "name": "mycategory"
}
```

