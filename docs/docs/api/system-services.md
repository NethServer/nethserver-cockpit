# system-services

Get the status and control system services.

## read

### Output

Current service status and preset is inside the `status` field.
The `configuration` field contains all properties for each service.

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
      "name": "cockpit.socket",
      "description": "Cockpit Web Service Socket"
    },
    ...
  ]
}

```

## update

Execute actions on selected service.

Available actions:

- stop: stop the service
- start: start the service
- restart: restart the service
- enable: enable and start the service
- disable: disable and start the service

### Input

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
