# read

Return the system hostname.

Output example:
```
{"hostname":"myserver.test.local"}
```

# validate

Input: the same output of read.

Example:
```
echo '{"hostname":"localhost.localdomain"}' | ./validate
```

# update

Input: the same as validate
