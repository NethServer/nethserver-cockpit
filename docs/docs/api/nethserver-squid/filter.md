# filter

Read and set global content filter configuration.

## read

The read API takes an `action` field.

Valid actions are:

- `configuration`
- `profiles`
- `objects`

Input example:
```json
{
  "action": "configuration"
}
```

### Output

#### configuration

The `configuration` key contains the `squid` record from configuration db.

Output example:
```json
{
  "configuration": {
    "AntiVirus": "disabled",
    "DomainWhitelist": [
      "allow1.org"
    ],
    "DomainBlacklist": [
      "block2.org",
      "block1.org"
    ],
    "UrlBlacklist": [
      "block3.org/url"
    ],
    "BlockedFileTypes": [],
    "Filter": "disabled",
    "Expressions": "disabled",
    "UrlWhitelist": [
      "allow2.org/url2",
      "allow1.org/url1"
    ]
  }
}
```

#### profiles

Return the list of configured profiles.
The `broken` field is set to 1 if the profile is using a filter which
contains non-existing categories.

Output example:
```json
{
  "profiles": [
    {
      "Time": [],
      "name": "default_profile",
      "FilterElse": {
        "Categories": []
      },
      "broken": 0,
      "Filter": {
        "BlockIpAccess": "disabled",
        "Categories": [],
        "BlockFileTypes": "disabled",
        "name": "default",
        "BlockBuiltinRules": "disabled",
        "BlackList": "enabled",
        "BlockAll": "disabled",
        "type": "filter",
        "WhiteList": "enabled",
        "Description": "Default filter",
        "Removable": "no"
      },
      "type": "profile",
      "Src": {},
      "Description": "Default profile",
      "Removable": "no"
    },
    {
      "Time": [
        {
          "name": "work",
          "type": "time",
          "StartTime": "09:30",
          "EndTime": "10:00",
          "Description": "",
          "Days": [
            "m",
            "t"
          ]
        }
      ],
      "name": "p1",
      "FilterElse": {
        "BlockIpAccess": "disabled",
        "Categories": [
          "publicite",
          "nonexisting"
        ],
        "BlockFileTypes": "disabled",
        "name": "f2",
        "BlackList": "enabled",
        "BlockAll": "disabled",
        "type": "filter",
        "WhiteList": "disabled",
        "Description": ""
      },
      "broken": 1,
      "Filter": {
        "BlockIpAccess": "enabled",
        "Categories": [
          "associations_religieuses",
          "astrology",
          "custom1"
        ],
        "BlockFileTypes": "enabled",
        "name": "f1",
        "BlackList": "enabled",
        "BlockAll": "disabled",
        "type": "filter",
        "WhiteList": "enabled",
        "Description": ""
      },
      "type": "profile",
      "Src": {
        "name": "admin@local.neth.eu",
        "type": "user"
      },
      "Description": "",
      "Removable": "yes"
    }
  ]
}
```

#### objects

Output example:
```json
{
  "objects": [
    {
      "gecos": "Giacomo",
      "name": "giacomo@local.neth.eu",
      "type": "user"
    },
    {
      "name": "power@local.neth.eu",
      "type": "group"
    },
    {
      "name": "a123",
      "IpAddress": "1.2.3.4",
      "type": "host",
      "Description": ""
    },
    {
      "Address": "10.10.10.0/24",
      "name": "cidr1",
      "type": "cidr",
      "Description": ""
    },
    {
      "name": "g1",
      "Members": "a123,myhost2",
      "type": "host-group",
      "Description": ""
    },
    {
      "End": "192.168.1.11",
      "name": "range1",
      "Start": "192.168.1.10",
      "type": "iprange",
      "Description": ""
    },
    {
      "Network": "10.11.12.13/24",
      "name": "z1",
      "type": "zone",
      "Description": "",
      "Interface": "ens7"
    },
    {
      "name": "green",
      "type": "role",
      "Interfaces": "br0,eth2"
    }
  ]
}
```

## validate

Valid actions are:

- `configuration`
- `create-profile`
- `update-profile`

During profile creation and update, the validate should be done for each property.
Other valid actions:

- `Filter`
- `FilterElse`
- `Time`
- `Src`

### Constraints

Constraints for `configuration` action:

- Filter, Antivirus, Expressions: can be `enabled` or `disabled`
- Domains and URLs are not validated

Constraints for `update-profile` action:

- name: the profile must already exists

Constraints for `create-profile` action:

- name: the profile must not already exists

Constraints for `Filter` action:

- BlockIpAccess, BlockFileTypes, BlackList, BlockAll, WhiteList
- Categories: a list of existing categories 

Constraints for `FilterElse` action:

- name: the filter must already exists

Constraints for `Src` action:

- name: an existing object between host, host-group, cidr, iprange, zone, role, user, group

Constraints for `Time` action:

- Days: must be a list of values between 
- StartTime, EndTime: must be a valid time

### Input

#### configuration

Input example:
```json
{
  "AntiVirus": "disabled",
  "DomainWhitelist": [
    "allow1.org"
  ],
  "DomainBlacklist": [
    "block2.org",
    "block1.org"
  ],
  "UrlBlacklist": [
    "block3.org/url"
  ],
  "BlockedFileTypes": [],
  "Filter": "disabled",
  "Expressions": "disabled",
  "UrlWhitelist": [
    "allow2.org/url2",
    "allow1.org/url1"
  ],
  "DefaultFilter": {
    "BlockIpAccess": "disabled",
    "Categories": [],
    "BlockFileTypes": "disabled",
    "name": "default",
    "BlackList": "enabled",
    "BlockAll": "disabled",
    "type": "filter",
    "WhiteList": "enabled",
    "Description": "Default filter",
    "Removable": "no"
  }
}
```

#### create-profile

Input example:
```json
{
  "name": "p1",
}
```

#### update-profile

Input example:
```json
{ 
  "name": "p1",
}
```

#### Filter

Input example:
```json
{
  "BlockIpAccess": "disabled",
  "Categories": [
    "agressif"
  ],
  "BlockFileTypes": "disabled",
  "BlockBuiltinRules": "disabled",
  "BlackList": "enabled",
  "BlockAll": "disabled",
  "WhiteList": "enabled",
}
```

#### FilterElse

Input example:
```json
{
  "name": "filter1"
}
```

#### Time

Input example:
```json
{
  "StartTime": "09:30",
  "EndTime": "10:00",
  "Days": [
    "m",
    "t"
  ]
}
```

#### Src

Input example:
```json
{
  "name": "admin@local.neth.eu",
  "type": "user"
}
```

## update

Same input from validate helper for `configuration` actions.

The input of `update-profile` and `create-profile` it's the same execpt for the `action` field.

### Input

#### create-profile

Input example:
```json
{
  "Time": [
    {
      "StartTime": "09:30",
      "EndTime": "11:00",
      "Days": [
        "m",
        "t"
      ]
    }
  ],
  "name": "profile2",
  "FilterElse": "profile1",
  "Filter": {
    "BlockIpAccess": "enabled",
    "Categories": [
      "associations_religieuses",
      "astrology",
      "custom1"
    ],
    "BlockFileTypes": "enabled",
    "BlackList": "enabled",
    "BlockAll": "disabled",
    "WhiteList": "disabled"
  },
  "Src": {
    "name": "giacomo@local.neth.eu",
    "type": "user"
  },
  "Description": "",
  "action": "create-profile"
}
```

#### update-profile

Input example:
```json
{
  "Time": [
    {
      "StartTime": "09:30",
      "EndTime": "11:00",
      "Days": [
        "m",
        "t"
      ]
    }
  ],
  "name": "profile2",
  "FilterElse": "profile1",
  "Filter": {
    "BlockIpAccess": "enabled",
    "Categories": [
      "associations_religieuses",
      "astrology",
      "custom1"
    ],
    "BlockFileTypes": "enabled",
    "BlackList": "enabled",
    "BlockAll": "disabled",
    "WhiteList": "disabled"
  },
  "Src": {
    "name": "giacomo@local.neth.eu",
    "type": "user"
  },
  "Description": "",
  "action": "update-profile"
}
```

## delete

Delete the given profile.
Delete also all associated times and filter if they are not used in other filters.

Input example:
```json
{
  "name": "profile1"
}
```

