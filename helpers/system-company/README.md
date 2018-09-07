# system-company

Read ans set `OrganizationContact` record from `configuration` db.

# read

## Output

The `configuration` key contains the `OrganizationContact` record.

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

## Constraints

No constrains defined.

## Input

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
