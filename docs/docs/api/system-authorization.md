# system-authorization

Read the list of modules accessible by the user.

## read

### Output

It returns the list of enabled modules for the user.

- isRoot ('1' or '0'), validate that the user is `root`.
- isAdmin('1' or '0'), validate  that the user is member of the group `domain admins` (root returns '1').

Example:
```json
{
  "system": [
    "storage",
    "disk-usage",
    "certificates",
    "dns",
    "services",
    "users-groups",
    "network",
    "ssh",
    "tls-policy",
    "trusted-networks",
    "logs",
    "wizard",
    "applications",
    "software-center"
  ],
    "status": {
    "isRoot": 1,
    "isAdmin": 1
  },
  "applications": [
    "nethserver-nextcloud"
  ]
}
```
## validate

Check if a user has access to a given module.

### Constraints

- the user must belong to a group with permission to access the module
- action field can be `check-system` or `check-app`


### Input

Valid actions are listed below.

#### check-system


Check if the user can access given system module.

Example:
```json
{
  "action": "check-system",
  "name": "dns"
}
```

### check-app

Check if the user can access given application.

Example:
```json
{
  "action": "check-app",
  "name": "nethserver-nextcloud"
}
```

