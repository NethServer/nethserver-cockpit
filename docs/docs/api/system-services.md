# system-services

Get the status and control system services.

## read

### Input 

Take an `action` field.
Available actions are:

- `list`: list current services
- `status`: read current service status from systemd

#### list

Example:
```json
{
  "action": "list"
}
```

#### status

Take an extra `name` field containing the name of the service
Example:
```json
{
  "action": "status",
  "name": "httpd"
}
```

### Output


#### list

Current service status and preset is inside the `status` field.
The `configuration` field contains all properties for each service.
Users can create non-systemd network services; the `custom` field specify if the service is one of this kind

Example:
```json
{
  "status": [
    {
      "status": 1,
      "name": "chronyd",
      "running": 1
    },
    {
      "status": 1,
      "name": "cockpit.socket",
      "running": 1
    },
    ...
  ],
  "configuration": [
    {
      "ports": {
        "access": "green",
        "UDP": [
          "123"
        ],
        "TCP": [
          "123"
        ]
      },
      "props": {
        "NTPServer": "pool.ntp.org"
      },
      "name": "chronyd",
      "description": "NTP client/server"
    },
    {
      "ports": {
        "access": "green,red",
        "UDP": [],
        "TCP": []
      },
      "props": {},
      "custom": 0,
      "name": "cockpit.socket",
      "description": "Cockpit Web Service Socket"
    },
    ...
  ]
}

```

#### status

Return the status of the service from `systemctl status`.
Text is returned under `data` field and it's ASCII encoded.

Example
```json
{
  "data": "* httpd.service - The Apache HTTP Server\n   Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled; vendor preset: disabled)\n   Active: active (running) since Tue 2018-11-13 14:09:54 CET; 21h ago\n     Docs: man:httpd(8)\n           man:apachectl(8)\n Main PID: 3183 (httpd)\n   Status: \"Total requests: 0; Current requests/sec: 0; Current traffic:   0 B/sec\"\n   CGroup: /system.slice/httpd.service\n           |- 3183 /usr/sbin/httpd -DFOREGROUND\n           |- 4566 /usr/sbin/httpd -DFOREGROUND\n           |-32621 /usr/sbin/httpd -DFOREGROUND\n           |-32622 /usr/sbin/httpd -DFOREGROUND\n           |-32623 /usr/sbin/httpd -DFOREGROUND\n           |-32624 /usr/sbin/httpd -DFOREGROUND\n           `-32625 /usr/sbin/httpd -DFOREGROUND\n\nNov 13 14:55:45 test.local.neth.eu systemd[1]: Reloading The Apache HTTP Server.\nNov 13 14:55:45 test.local.neth.eu systemd[1]: Reloaded The Apache HTTP Server.\nNov 13 15:13:32 test.local.neth.eu systemd[1]: Reloading The Apache HTTP Server.\nNov 13 15:13:33 test.local.neth.eu systemd[1]: Reloaded The Apache HTTP Server.\nNov 13 15:45:33 test.local.neth.eu systemd[1]: Reloading The Apache HTTP Server.\nNov 13 15:45:33 test.local.neth.eu systemd[1]: Reloaded The Apache HTTP Server.\nNov 13 16:16:04 test.local.neth.eu systemd[1]: Reloading The Apache HTTP Server.\nNov 13 16:16:04 test.local.neth.eu systemd[1]: Reloaded The Apache HTTP Server.\nNov 13 16:16:30 test.local.neth.eu systemd[1]: Reloading The Apache HTTP Server.\nNov 13 16:16:30 test.local.neth.eu systemd[1]: Reloaded The Apache HTTP Server.\n"
}
```


## validate

Validate a custom network service.

Available actions:

- service-create: validate a new custom network service
- edit: validate an existing custom network service

### Input

A JSON object with these fields:

- action: action to execute
- serviceName: name of the service
- access: allowed access zones
- tcpPorts: list of TCP ports
- udpPorts: list of UDP ports

Example:
```json
{
  "action": "service-create",
  "serviceName": "myCustomService",
  "access": [
    "green",
    "red"
  ],
  "tcpPorts": [
    "9696"
  ],
  "udpPorts": [
    "8765",
    "8766"
  ]
}
```

Invocation example:
```bash
echo '{"action":"service-create","serviceName":"myCustomService","access":["green","red"],"tcpPorts":["9696"],"udpPorts":["8765","8766"]}' | ./validate
```


## create

Create a custom network service.

Available actions:

- service-create: create a custom network service

### Input

The same as `validate`


## update

Execute actions on selected service.

Available actions:

- stop: stop the service
- start: start the service
- restart: restart the service
- enable: enable and start the service
- disable: disable and start the service
- edit: edit access zones and TCP/UDP ports of the service

### Input

#### stop, start, restart, enable, disable

A JSON object with two fields:

- name: the service name
- action: the action to execute

Example:
```json
{
  "action": "enable",
  "name": "httpd"
}
```

Invocation example:
```bash
echo '{"action":"restart","name":"httpd"}' | ./update
```

#### edit

A JSON object with these fields:

- action: `edit`
- serviceName: name of the service
- access: allowed access zones
- tcpPorts: list of TCP ports
- udpPorts: list of UDP ports

Example:
```json
{
  "action": "edit",
  "serviceName": "myCustomService",
  "access": [
    "red"
  ],
  "tcpPorts": [
    "9696"
  ],
  "udpPorts": [
    "7878",
    "5454"
  ]
}
```

Invocation example:
```bash
echo '{"action":"edit","serviceName":"myCustomService","access":["red"],"tcpPorts":["9696"],"udpPorts":["7878","5454"]}' | ./update
```

## delete

Delete a custom network service.

Available actions:

- service-delete: delete a custom network service

### Input

A JSON object with two fields:

- action: the action to execute
- serviceName: the service name

Example:
```json
{
  "action": "service-delete",
  "serviceName": "myCustomService"
}
```

Invocation example:
```bash
echo '{"action":"service-delete","serviceName":"myCustomService"}' | ./delete
```
