# system-proxy

Read and set `proxy` record from `configuration` db.

## read

### Output

The `configuration` key contains the `proxy` record.

Output example:
```json
{
  "status": "",
  "configuration": {
    "props": {
      "password": "",
      "user": "",
      "port": "3128",
      "host": "192.168.1.1"
    },
    "name": "proxy",
    "type": "configuration"
  }
}
```

## validate

### Constraints

- host: a valid hostname, IP address or empty
- port: a valid TCP port or empty 

### Input

Input: an esmith db record in JSON format.

Input example from: `config getjson proxy`:
```json
{
  "props": {
    "password": "",
    "user": "",
    "port": "3128",
    "host": "192.168.1.1"
  },
  "name": "proxy",
  "type": "configuration"
}
```

## update

Same input from validate helper.
