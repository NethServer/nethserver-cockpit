# objects

Manage fireall objects

## read

### Input

The read API requires an action field.
Valid actions:

- `hosts`
- `services`
- `wans`
- `protocols`
- `zones`
- `time-conditions`
- `interfaces`

#### hosts

Return the list of hosts from `hosts` database.

Example:
```json
{
  "action": "hosts"
}
```

#### services

Return the list of services from `fwservices` db.

Example:
```json
{
  "action": "services"
}
```

#### wans

Return the list of red IPs.

Example:
```json
{
  "action": "wans"
}
```

#### protocols

Return the list of protocols from `/etc/protocols`.

Example:
```json
{
  "action": "protocols"
}
```

#### zones

Return the list of zones from `networks` db.

Example:
```json
{
  "action": "zones"
}
```

#### time-conditions

Return the list of time conditions from `fwtimes` db.

Example:
```json
{
  "action": "time-conditions"
}
```

#### time-conditions

Return the list of interfaces from `networks` db.

Example:
```json
{
  "action": "interfaces"
}
```

### Output

#### hosts

Output example:
```json
{
  "hosts": [
    {
      "IpAddress": "192.168.1.1",
      "name": "a123",
      "Description": "123"
    },
    ...
  ]
}
```
#### services

Example:
```json
{
  "services": [
    {
      "Ports": [
        "67",
        "68"
      ],
      "name": "dhcp",
      "Protocol": "tcpudp",
      "type": "fwservice",
      "Description": ""
    },
    ...
  ]
}
```

#### wans

Example:
```json
{
  "wans": [
    "192.168.100.194",
    "10.0.0.212",
    "1.2.3.4"
  ]
}
```

#### protocols

Example:
```json
{
  "protocols": [
    "gre",
    "ah",
    "tcp",
    ...
  ]
}
```

#### zones

Example:
```json
{
  "zones": [
    {
      "Network": "192.168.66.3/14",
      "name": "test",
      "Description": "test",
      "Interface": "eth0"
    },
    ...
  ]
}

```

#### time-conditions

Example:
```json
{
  "time-conditions": [
    {
      "WeekDays": [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ],
      "TimeStart": "00:00",
      "TimeStop": "02:30",
      "name": "test",
      "Description": "test"
    },
    ...
  ]
}
```

#### interfaces

Example:
```json
{
  "interfaces": [
    "eth0",
    "eth1",
    ...
  ]
}
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `create-host`
- `update-host`
- `delete-host`

Constraints for `create-host`:

- name: must be a non-existing class
- IpAddress: must be valid ipv4
- Description: optional description

Constraints for `update-host`:

- name: must be an existing host
- IpAddress: must be valid ipv4
- Description: optional description

Constraints for `update-host`:

- name: must be an existing host


### Input

#### create

Example:
```json
```

#### update

Example:
```json
```

#### delete

Example:
```json
{
  "action": "delete",
  "name": "myobject"
}
```


## update

Same input format from validate action.

## create

It uses the same format from input action.

## delete

It uses the same format from input action.
