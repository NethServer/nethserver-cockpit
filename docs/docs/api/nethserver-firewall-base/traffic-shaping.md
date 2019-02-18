# traffic-shaping

Manage traffic shaping configuration.

## read

### Input

The read API requires an action field.
Valid actions:

- `classes`
- `stats`
- `rules`

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
        "BindTo": [
          "ens7",
          "ens8"
        ],
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
      "high": [
        "0",
        "0",
        ...
      ],
      "time": [
        "1548143776",
        "1548143775",
        ...
      ],
      "low": [
        "0",
        "0",
        ...
      ],
      "default": [
        "0.0115016",
        "0.762703",
        ...
      ],
      "voip": [
        "0",
        "0",
        ...
      ]
    },
    "in": {
      "high": [
        "0",
        "0",
        ...
      ],
      "time": [
        "1548143776",
        "1548143775",
        ...
      ],
      "low": [
        "0",
        "0",
        ...
      ],
      "default": [
        "0",
        "0.0311577",
        ...
      ],
      "voip": [
        "0",
        "0",
        ...
      ]
    }
  },
  "red2": {
    "out": {
      "high": [
        "0",
        "0",
        ... 
      ],
      "time": [
        "1548143776",
        "1548143775",
        ...
      ],
      "low": [
        "0",
        "0",
        ...
      ],
      "default": [
        "0.0456097",
        "2.49839",
        ...
      ],
      "voip": [
        "0",
        "0",
        ...
      ]
    },
    "in": {
      "high": [
        "0",
        "0",
        ...
      ],
      "time": [
        "1548143776",
        "1548143775",
        ...
      ],
      "low": [
        "0",
        "0",
        ...
      ],
      "default": [
        "0.0289281",
        "1.2430719",
        ...
      ],
      "voip": [
        "0",
        "0",
        ...
      ]
    }
  }
}
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

Example with `expand` set to `true`:
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

- `create`
- `create-default`
- `update`

Common constratins:

- MaxInputRate, MaxOutputRate, MinInputRate, MinOutputRate: empty or an integer greater than 0
- Unit: can be `kbps` or `%` 
- BindTo: empty or a list of existing red interfaces

Constraints for `create`:

- name: must be a non-existing class

Constraints for `update`:

- name: must be an existing class

### Input

#### create

Example:
```json
{
  "action": "create",
  "MinOutputRate": "",
  "BindTo": [
    "ens7"
  ],
  "name": "myclass",
  "MaxOutputRate": 90,
  "MaxInputRate": 90,
  "MinInputRate": null,
  "Description": "",
  "Unit": "%"
}
```

#### create-default

Example:
```json
{
  "action": "create-default"
}
```

#### update

Example:
```json
{
  "action": "update",
  "MinOutputRate": "",
  "BindTo": [
    "ens7",
    "ens8"
  ],
  "name": "myclass",
  "MaxOutputRate": 90,
  "MaxInputRate": 90,
  "MinInputRate": null,
  "Description": "",
  "Unit": "kbps"
}
```

#### delete

Example:
```json
{
  "action": "delete",
  "name": "myclass"
}
```


## update

Same input format from validate action.

## create

It uses the same format from input action.

## delete

It uses the same format from input action.
