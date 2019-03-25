# traffic-shaping

Manage traffic shaping configuration.

## read

### Input

The read API requires an action field.
Valid actions:

-   `classes`
-   `stats`
-   `rules`

#### classes

Return the list of traffic shaping classes from `tc` database.

Example:

```json
{
    "action": "classes"
}
```

#### stats

Retrieve tc class usage for each red interface using netdata.

Example:

```json
{
    "action": "stats"
}
```

#### rules

List the traffic shaping rules.

The `rules` action takes an extra parameter `expand`.
If `expand` is set to `true`, the api will try to expand all objects involved in the rules
returning information about IP address, zone, etc.

Example:

```json
{
    "action": "rules",
    "expand": true
}
```

### Output

#### classes

Output example:

```json
{
    "status": null,
    "configuration": {
        "classes": [
            {
                "MinOutputRate": "10",
                "BindTo": [],
                "name": "high",
                "MaxOutputRate": "",
                "MaxInputRate": "",
                "MinInputRate": "10",
                "Description": "",
                "Unit": "%"
            },
            {
                "MinOutputRate": "",
                "BindTo": [],
                "name": "low",
                "MaxOutputRate": "90",
                "MaxInputRate": "90",
                "MinInputRate": "",
                "Description": "",
                "Unit": "%"
            },
            {
                "MinOutputRate": "1",
                "BindTo": ["ens7", "ens8"],
                "name": "voip",
                "MaxOutputRate": "",
                "MaxInputRate": "",
                "MinInputRate": "1",
                "Description": "VoIP",
                "Unit": "kbps"
            }
        ]
    }
}
```

#### stats

Output example:

```json
{
  "red1": {
    "out": {
      "data": [
        [
          1553521843,
          0,
          0,
          0
        ],
        [
          1553521842,
          0,
          0,
          0
        ]
      ],
      "labels": [
        "time",
        "default",
        "low",
        "high"
      ]
    },
    "in": {
      "data": [
        [
          1553521843,
          0,
          0,
          0
        ],
        [
          1553521842,
          0,
          0,
          0
        ]
      ],
      "labels": [
        "time",
        "default",
        "low",
        "high"
      ]
    }
  },
  ...
}
```

If data for red interfaces is not available (e.g. netdata is not running):

```json
{
    "ens7": null,
    "ens8": null
}
```

#### rules

List all traffic shaping (QoS) rules.

The `status` section contains the `count` of existing rules,
and the `next` position available for newly created rule.

Example with `expand` set to `true`:

```json
{
  "status": {
    "next": 12,
    "count": 5
  },
  "rules": [
    {
      "Log": "none",
      "Time": null,
      "Position": 640,
      "status": "enabled",
      "Service": {
        "name": "any",
        "type": "fwservice"
      },
      "Action": "class;high",
      "Dst": {
        "zone": "red",
        "IpAddress": "90.147.160.70-90.147.160.73",
        "name": "garr",
        "type": "iprange"
      },
      "id": "34",
      "type": "rule",
      "Src": {
        "name": "any",
        "type": "any"
      }
    }
    ...
  ]
}
```

Example with `expand` set to `false`:

```json
{
  "rules": [
    {
      "Log": "none",
      "Time": null,
      "Position": 640,
      "status": "enabled",
      "Service": {
        "name": "any",
        "type": "fwservice"
      },
      "Action": "class;high",
      "Dst": {
        "name": "garr",
        "type": "iprange"
      },
      "id": "34",
      "type": "rule",
      "Src": {
        "name": "any",
        "type": "any"
      }
    }
    ...
  ]
}
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

-   `create-class`
-   `update-class`
-   `create-rule`
-   `update-rule`

Common constratins:

-   MaxInputRate, MaxOutputRate, MinInputRate, MinOutputRate: empty or an integer greater than 0
-   Unit: can be `kbps` or `%`
-   BindTo: empty or a list of existing red interfaces

Constraints for `create-class`:

-   name: must be a non-existing class

Constraints for `update-class`:

-   name: must be an existing class

Constraints for `delete-class`:

-   name: must be an existing class
-   the class must not be used in any firewall rule

Constraints for `create-rule` and `update-rule`:

-   All constraints from [firewall rules](/api/nethserver-firewall-base/rules.md#validate)
-   Action: must be an existing class in the form `class;<name>`
-   Src: can't be red role
-   Dst: can be red role or host or iprange or zone or cidr
-   id: must exists on update

### Input

#### create-class

Example:

```json
{
    "action": "create-class",
    "MinOutputRate": "",
    "BindTo": ["ens7"],
    "name": "myclass",
    "MaxOutputRate": 90,
    "MaxInputRate": 90,
    "MinInputRate": null,
    "Description": "",
    "Unit": "%"
}
```

#### update-class

Example:

```json
{
    "action": "update-class",
    "MinOutputRate": "",
    "BindTo": ["ens7", "ens8"],
    "name": "myclass",
    "MaxOutputRate": 90,
    "MaxInputRate": 90,
    "MinInputRate": null,
    "Description": "",
    "Unit": "kbps"
}
```

#### delete-class

Example:

```json
{
    "action": "delete-class",
    "name": "myclass"
}
```

#### create-rule

Example:

```json
{
    "Log": "none",
    "Time": null,
    "Position": 4,
    "status": "enabled",
    "Service": {
        "name": "any",
        "type": "fwservice"
    },
    "Action": "class;high",
    "Dst": {
        "name": "red",
        "type": "role"
    },
    "Src": {
        "name": "myhost.nethserver.org",
        "type": "host"
    },
    "type": "rule",
    "action": "create-rule"
}
```

#### edit-rule

Example:

```json
{
    "Log": "none",
    "Time": null,
    "Position": 4,
    "status": "enabled",
    "Service": {
        "name": "any",
        "type": "fwservice"
    },
    "Action": "class;high",
    "Dst": {
        "name": "red",
        "type": "role"
    },
    "id": "6",
    "Src": {
        "name": "myhost.nethserver.org",
        "type": "host"
    },
    "type": "rule",
    "action": "create-rule"
}
```

## update

Use the same input from validate, supports also the `reorder` action.

### reorder

The `rules` field contains an ordered list of rules id.
The API will update all `Position` properties accordingly to given order.

Input example:

```json
{
    "action": "reorder",
    "rules": [24, 55, 2]
}
```

## create

It uses the same format from input action.

#### create-default

Create default classes.

Example:

```json
{
    "action": "create-default"
}
```

## delete

Takes an `action` field.

Valid actions are:

-   `delete-class`
-   `delete-rule`

Example:

```json
{
    "action": "delete-class",
    "name": "123"
}
```
