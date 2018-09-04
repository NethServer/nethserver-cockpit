# read

Output example:
```
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

Input: an esmith db record in JSON format.

Input example from: `config getjson sshd`:
```
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

Input: the same of validate helper
