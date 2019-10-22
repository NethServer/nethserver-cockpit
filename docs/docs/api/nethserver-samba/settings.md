# settings

Manage common configuration for shared folders.

## read

Read the configuration of shared folder configurations.
No input required.

### Output

Example:
```json
{
  "InheritOwner": "no",
  "WorkgroupEditable": false,
  "Workgroup": "LOCAL",
  "HomeAdmStatus": "disabled",
  "ShareAdmStatus": "disabled",
  "AuditLogRead": "disabled"
}
```

The `WorkgroupEditable` is set to `false` if the user account provider is set to Active Directory.

## validate

Constraints::

- ShareAdmStatus, HomeAdmStatus, AuditLogRead: can be `enabled` or `disabled`
- InheritOwner: can be `yes` or `no`
- Workgroup: a simple hostname, maximum length is 15 characters

### Input

Input example:
```json
{
  "InheritOwner": "no",
  "Workgroup": "LOCAL",
  "HomeAdmStatus": "disabled",
  "ShareAdmStatus": "disabled",
  "AuditLogRead": "disabled"
}
```

## update

Use same input from validate.

