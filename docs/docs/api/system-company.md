# system-company

Read and set `OrganizationContact` record from `configuration` db.

## read

### Output

The `configuration` key contains the `OrganizationContact` record.

Output example:
```json
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

## validate

### Constraints

- Company must not empty

### Input

Input: an esmith db record in JSON format.

Input example from: `config getjson OrganizationContact`:
```json
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

## update

Same input from validate helper.
