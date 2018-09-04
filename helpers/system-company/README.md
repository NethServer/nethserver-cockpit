# read

Output example:
```
{
  "status": "",
  "configuration": {
    "props": {
      "Department": "Main",
      "Street": "123 Main Street",
      "PhoneNumber": "575-1685",
      "City": "Hometown",
      "State": "",
      "CountryCode": "",
      "Company": "Example Org"
    },
    "name": "OrganizationContact",
    "type": "configuration"
  }
}
```

# validate

Input: an esmith db record in JSON format.

Input example from: `config getjson OrganizationContact`:
```
{
  "props": {
    "Department": "Main",
    "Street": "123 Main Street",
    "PhoneNumber": "575-1685",
    "City": "Hometown",
    "State": "",
    "CountryCode": "",
    "Company": "Example Org"
  },
  "name": "OrganizationContact",
  "type": "configuration"
}
```

# write

Input: the same of validate helper
