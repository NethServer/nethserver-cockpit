# read

List current configured aliases.

Inside the `configuration` key there is a list of alias prop.
Output example:
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

# validate

Validate a collection of alias records.

Input: the same as read output

Example:
```
echo '{ "configuration" : [{"props":{"Description":""},"name":"test3.neth.eu","type":"self"}, {"props":{"Description":""},"name":"test2.neth.eu","type":"self"}]}' | ./validate
```

# update

Remove all existing alias and set the new ones.

Input: the same as validate

Example:
```
echo '{ "configuration" : [{"props":{"Description":""},"name":"test3.neth.eu","type":"self"}, {"props":{"Description":""},"name":"test2.neth.eu","type":"self"}]}' | ./update
```
