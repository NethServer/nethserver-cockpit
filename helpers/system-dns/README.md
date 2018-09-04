# read

Return the value of `sshd` prop value.

Example:
```
{
  "status": "",
  "configuration": {
    "props": {
      "NameServers": "8.8.8.8"
    },
    "name": "dns",
    "type": "configuration"
  }
}
```

# validate

Input: an esmith db record in JSON format.

The NameServers property is a comma-separated list of IP address.
It must contain at least one element.

Validation example:
```
echo '{"props":{"NameServers":"8.8.8.8"},"name":"dns","type":"configuration"}' | ./validate
```

# write

Use the same input of validate.
