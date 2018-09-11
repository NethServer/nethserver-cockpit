# system-alias

Read and write system DNS system alias.

## read

List current configured aliases.

### Output

The `configuration` contains an array of alias records (type `self` from `hosts` db).

Output example:
```json
{
  "status": "",
  "configuration": [
    {
      "props": {
        "Description": ""
      },
      "name": "alias1.neth.loc",
      "type": "self"
    }
  ]
}
```

## validate

Validate a collection of alias records.

### Constraints

- the alias `name` must be a valid FQDN

### Input

Use the read output as input.
Each record must have the type set to `self`, the `Description` field is currently not used.

Example:
```json
{
  "configuration": [
    {
      "props": {
        "Description": ""
      },
      "name": "test3.nethserver.org",
      "type": "self"
    },
    {
      "props": {
        "Description": ""
      },
      "name": "test2.nethserver.org",
      "type": "self"
    }
  ]
}
```

Invocation example:
```bash
echo '{ "configuration" : [{"props":{"Description":""},"name":"test3.nethserver.org","type":"self"}, {"props":{"Description":""},"name":"test2.nethserver.org","type":"self"}]}' | ./validate
```

## update

All alias are destroyed and recreated on update.
The helper should be invoked once, after all alias has been modified.

### Input

The same from validate helper.

Invocation example:
```bash
echo '{ "configuration" : [{"props":{"Description":""},"name":"test3.neth.eu","type":"self"}, {"props":{"Description":""},"name":"test2.neth.eu","type":"self"}]}' | ./update
```
