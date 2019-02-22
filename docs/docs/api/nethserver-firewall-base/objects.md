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
- `applications`
- `local-services`

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

#### applications

Return the list of NDPI applications/protocols.

Example:
```json
{
  "action": "applications"
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

#### interfaces

Return the list of interfaces from `networks` db.

Example:
```json
{
  "action": "interfaces"
}
```

#### local-services

Return the list of services running on the firewall itself (from `configuration` db).

Example:
```json
{
  "action": "local-services"
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

#### applications

Return the list of NDPI applications/protocols.
Each protocol has an associated icon, icon mapping is configured inside the `ndpi-icons.json` file.

Example:
```json
{
  "applications": [
    {
      "icon": "fa-circle",
      "name": "Unknown",
      "id": "00"
    },
    {
      "icon": "fa-cloud-download",
      "name": "FTP_CONTROL",
      "id": "01"
    },
    ...
  ]
}
```

#### local-services

Return the list of services running on the firewall itself.

Example:
```json
{
  "local-services": [
    {
      "Ports": [
        "123"
      ],
      "name": "chronyd",
      "Protocol": "udp",
      "type": "service",
      "Description": ""
    },
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
- `create-service`
- `update-service`
- `delete-service`
- `create-zone`
- `update-zone`
- `delete-zone`
- `create-time-condition`
- `update-time-condition`
- `delete-time-condition`
- `create-cidr-sub`
- `update-cidr-sub`
- `delete-cidr-sub`
- `create-ip-range`
- `update-ip-range`
- `delete-ip-range`
- `create-host-group`
- `update-host-group`
- `delete-host-group`

Constraints for `create-host`:

- name: must be a non-existing class
- IpAddress: must be valid ipv4
- Description: optional description
- portforwards: optional list of valid portforwards to set host as `DstHost`

Constraints for `update-host`:

- name: must be an existing host
- IpAddress: must be valid ipv4
- Description: optional description
- portforwards: optional list of valid portforwards to set host as `DstHost`

Constraints for `delete-host`:

- name: must be an existing host

Constraints for `create-service`:

- name:  must be a non-existing service
- Ports: must be a port range or a valid list of ports
- Protocol: must be one this vaules: 'tcp','udp','tcpudp'
- Description: optional description

Constraints for `update-service`:

- name:  must be a existing service
- Ports: must be a port range or a valid list of ports
- Protocol: must be one this vaules: 'tcp','udp','tcpudp'
- Description: optional description

Constraints for `delete-service`:

- name: must be an existing service

Constraints for `create-zone`:

- name: must be a non-existing zone
- Network: must be a valid CIDR block
- Interface: must be an existing interface name
- Description: optional description

Constraints for `update-zone`:

- name: must be a existing zone
- Network: must be a valid CIDR block
- Interface: must be an existing interface name
- Description: optional description

Constraints for `delete-zone`:

- name: must be an existing zone

Constraints for `create-time-condition`:

- name: must be a non-existing time condition
- WeekDays: a list of day where apply the time condition, valid values:
`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`,`Sun`
- TimeStart: time to start the time condition
- TimeStop: time to stop the time condition
- Description: optional description

Constraints for `update-time-condition`:

- name: must be a existing time condition
- WeekDays: a list of day where apply the time condition, valid values:
`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`,`Sun`
- TimeStart: time to start the time condition
- TimeStop: time to stop the time condition
- Description: optional description

Constraints for `delete-time-condition`:

- name: must be an existing time condition

Constraints for `create-cidr-sub`:

- name: must be a non-existing cidr subnet
- Address: must be a valid CIDR block
- Description: optional description

Constraints for `update-cidr-sub`:

- name: must be a existing cidr subnet
- Address: must be a valid CIDR block 
- Description: optional description

Constraints for `delete-cidr-sub`:

- name: must be an existing cidr subnet

Constraints for `create-ip-range`:

- name: must be a non-existing ip range
- Start: start of the range, must be a valid ipv4
- End: end of the range, must be a valid ipv4
- Description: optional description

Constraints for `update-ip-range`:

- name: must be a existing ip range
- Start: start of the range, must be a valid ipv4
- End: end of the range, must be a valid ipv4
- Description: optional description

Constraints for `delete-ip-range`:

- name: must be an existing ip range

Constraints for `create-host-group`:

- name: must be a non-existing host group
- Members: must be a list of existing host
- Description: optional description

Constraints for `update-host-group`:

- name: must be a existing host group
- Members: must be a list of existing host
- Description: optional description

Constraints for `delete-host-group`:

- name: must be an existing host group

### Input

#### create-host

Example:
```json
{
  "action": "create-host",
  "IpAddress": "192.168.1.1",
  "name": "a123",
  "Description": "123",
  "portforwards": [1,3]
}
```

#### update-host

Example:
```json
{
  "action": "update-host",
  "IpAddress": "192.168.1.3",
  "name": "a123",
  "Description": "123",
  "portforwards": [1]
}
```

#### delete-host

Example:
```json
{
  "action": "delete-host",
  "name": "a123"
}
```

#### create-service

Example:
```json
{ 
  "action": "create-service",
  "Ports": ["80"],
  "name": "httpd",
  "Protocol": "tcp",
  "Description": ""
}
```

#### update-service

Example:
```json
{ 
  "action": "create-service",
  "Ports": ["80","443"],
  "name": "httpd",
  "Protocol": "tcp",
  "Description": ""
}
```

#### delete-service

Example:
```json
{
  "action": "delete-service",
  "name": "httpd"
}
```

#### create-zone

Example:
```json
{
  "action": "create-zone",
  "Network": "192.168.66.3/14",
  "name": "test",
  "Description": "test",
  "Interface": "eth0"
}
```

#### update-zone

Example:
```json
{
  "action": "update-zone",
  "Network": "192.168.66.7/14",
  "name": "test",
  "Description": "test",
  "Interface": "eth1"
}
```

#### delete-zone

Example:
```json
{
  "action": "delete-zone",
  "name": "test"
}
```
#### create-time-condition

Example:
```json
{
  "action": "create-time-condition",
  "WeekDays": [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ],
  "TimeStart": "01:30",
  "TimeStop": "02:00",
  "name": "test",
  "Description": "test"
}
```

#### update-time-condition

Example:
```json
{
  "action": "update-time-condition",
  "WeekDays": [
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ],
  "TimeStart": "01:30",
  "TimeStop": "05:00",
  "name": "test",
  "Description": "test"
}

```

#### delete-time-condition

Example:
```json
{
  "action": "delete-time-condition",
  "name": "test"
}
```

#### create-cidr-sub

Example:
```json
{
  "action": "create-cidr-sub",
  "Address": "10.10.10.0/24",
  "name": "cidr1",
  "Description": ""
}
```

#### update-cidr-sub

Example:
```json
{
  "action": "update-cidr-sub",
  "Address": "10.10.30.0/24",
  "name": "cidr1",
  "Description": ""
}
```

#### delete-cidr-sub

Example:
```json
{
  "action": "delete-cidr-sub",
  "name": "cidr1"
}
```

#### create-ip-range

Example:
```json
{ "action": "create-ip-range",
  "End": "192.168.1.10",
  "name": "range1",
  "Start": "192.168.1.100",
  "Description": ""
}
```

#### update-ip-range

Example:
```json
{ "action": "update-ip-range",
  "End": "192.168.1.10",
  "name": "range1",
  "Start": "192.168.1.100",
  "Description": ""
}

```

#### delete-ip-range

Example:
```json
{
  "action": "delete-ip-range",
  "name": "range1"
}
```

#### create-host-group

Example:
```json
{ "action": "create-host-group",
   "Members": [
     "host1"
   ],
   "name": "g1",
   "Description": ""
}
```

#### update-host-group

Example:
```json
{ "action": "update-host-group",
   "Members": [
     "host1"
   ],
   "name": "g1",
   "Description": ""
}
```

#### delete-host-group

Example:
```json
{
  "action": "delete-host-group",
  "name": "g1"
}
```
## update

Same input format from validate action.

## create

It uses the same format from input action.

## delete

It uses the same format from input action.
