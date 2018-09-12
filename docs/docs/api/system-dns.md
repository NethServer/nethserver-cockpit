# system-dns

Read and set upstream DNS servers for DNSMasq.

## read

### Input

Return the value of `NameServers` record from `configuration` db.
The record is inside the the `configuration` field:
```json
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

## validate

### Constraints

- NameServers must be a comma-separated list of valid IPv4 addresses

### Input

The `NameServers` record from `configuration  esmith db record in JSON format.

The NameServers property is a comma-separated list of IP address.
It must contain at least one element.

Example:
```json
{
  "props": {
    "NameServers": "8.8.8.8"
  },
  "name": "dns",
  "type": "configuration"
}
```

Validation example:
```bash
echo '{"props":{"NameServers":"8.8.8.8"},"name":"dns","type":"configuration"}' | ./validate
```

# write

Same input from validate helper.
