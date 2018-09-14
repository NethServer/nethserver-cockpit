# system-tls-policy

Read ans set `tls` configuration record.

## read

### Output

The `tls` record is returned inside the `configuration` field.

```json
{
    "status": {
        "available": ["20180621", "20180330"]
    },
    "configuration": {
        "props": {
            "policy": "20180621"
        },
        "name": "tls",
        "type": "configuration"
    }
}
```

## validate

### Constraints

-   policy must be: `20180330`, `20180621`
-   if a custom ecda certificate is set, check if current policy supports it

### Input

The input must be an esmith record in JSON format.

Input example:

```json
{
    "props": {
        "policy": "20180621"
    },
    "name": "tls",
    "type": "configuration"
}
```

Invocation example:

```bash
echo '{"props":{"policy":"20180621"},"name":"tls","type":"configuration"}' | ./validate
```

## update

The same from validate helper.
