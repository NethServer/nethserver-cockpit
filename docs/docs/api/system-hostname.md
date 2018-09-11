# system-hostname

Read and the set the system hostname.


## read

Return the system hostname.

### Output

Example:
```json
{"hostname":"myserver.test.local"}
```

## validate

### Constraints

- Must be at least a second-level domain
- Can't be `localhost.localdomain`
- Validate against `myhostname` system-validator 

### Input

Takes the same output from read:
```json
{
  "hostname": "myserver.test.local"
}
```

Invocation example:
```bash
echo '{"hostname":"localhost.localdomain"}' | ./validate
```

## update

### Input

Takes the same input from validate.
