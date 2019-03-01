# system-roles

API to store the roles delegation of a group in the json file 
`/etc/nethserver/cockpit/authorization/roles.json` and to display the role delegation of a group in the group panel of cockpit

## read

Valid actions are listed below.

### input 

#### roles

It returns the list of role delegations for a group. 

- `system` are delegation for the system modules
- `applications` are delegation for application modules
- `editable` is used for the `domain admins` group (set to '0') to prevent to remove delegation to that group, others group are set to '1' and you are able to remove the delegation.

Example:

```json
{
    "system": [
     "storage",
     "disk-usage",
     "certificates",
     "dns",
     "dhcp",
     "backup",
     "services",
     "users-groups",
     "network",
     "ssh",
     "tls-policy",
     "trusted-networks",
     "logs"
   ],
   "status": {
     "editable": 0
   },
   "applications": []
}
```

Invocation example:

```bash
echo '{"role":"domain admins"}'|/usr/libexec/nethserver/api/system-roles/read| jq
```

#### applications

It returns the complete list of system and applications modules to create the cockpit dropdown menus for the role delegations in the groups panel

Example:

```json
{
  "system": [
    "storage",
    "disk-usage",
    "certificates",
    "dns",
    "dhcp",
    "backup",
    "services",
    "users-groups",
    "network",
    "ssh",
    "tls-policy",
    "trusted-networks",
    "logs"
  ],
  "status": {
    "editable": 1
  },
  "applications": []
}
```

Invocation example:

```bash
echo '{"action":"applications"}'|/usr/libexec/nethserver/api/system-roles/read| jq
```

## Update

Update the json file `/etc/nethserver/cockpit/authorization/roles.json` with the new role delegation and expand the file `/etc/sudoers.d/30_nethserver_cockpit_roles`

### input 

Invocation example:

```bash
 echo '{"role":"sysadmin","system":["storage","dhcp","backup"],"applications":["nethserver-mattermost"]}' | /usr/bin/sudo /usr/libexec/nethserver/api/system-roles/update | jq
 ```

## Delete

Update the json file `/etc/nethserver/cockpit/authorization/roles.json` by removing the role delegation of a group when it is deleted

### input 

Invocation example:

```bash
 echo '{"role":"sysadmin"}' | /usr/bin/sudo /usr/libexec/nethserver/api/system-roles/delete | jq
 ```

