# openssh

Read and write configuration for nethserver-openssh package.

# read

## Output

A JSON object containing `configuration` and `status` fields:
```json
{
    "configuration" : { <sshd prop> },
    "status" : { "connections": <list of active connections> }
}
```

Output example:
```json
{
    "configuration": {
        "name": "sshd",
        "props": {
            "LoginGraceTime": "2m",
            "MaxAuthTries": "6",
            "PasswordAuthentication": "yes",
            "PermitRootLogin": "yes",
            "Protocol": "2",
            "TCPPort": "22",
            "UsePAM": "yes",
            "access": "green,red",
            "status": "enabled"
        },
        "type": "service"
    },
    "status": {
        "connections": [
            {
                "local": "192.168.1.1:22",
                "peer": "192.168.1.45:54478"
            }
        ]
    }
}
```

# validate

## Constraints

- PasswordAuthentication: boolean
- PermitRootLogin: boolean
- TCPPort: port number
- status: `enabled` or `disabled`

## Input

An Esmith db record in JSON format:
```json
{
    "name": <key>,
    "props": {
        <prop>: <value>
        ...
        <prop>: <value>
    },
    "type": <record-type>
}
```

Input example from: `config getjson sshd`:
```json
{
    "name": "sshd",
    "props": {
        "LoginGraceTime": "2m",
        "MaxAuthTries": "6",
        "PasswordAuthentication": "yes",
        "PermitRootLogin": "yes",
        "Protocol": "2",
        "TCPPort": "22",
        "UsePAM": "yes",
        "access": "green,red",
        "status": "enabled"
    },
    "type": "service"
}
```

Usage example:
```
echo '{"props":{"status":"enable","access":"green,red","MaxAuthTries":"6","UsePAM":"yes","PasswordAuthentication":"yes","LoginGraceTime":"2m","Protocol":"2","PermitRootLogin":"yes","TCPPort":"22"},"name":"sshd","type":"service"}' | ./validate
```

# write

Set and apply OpenSSH configuration.

## Input

Same from validate helper.
