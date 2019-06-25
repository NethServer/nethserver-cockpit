# virtualhost

Manage virtualhost configuration for apache server.

## Read

The read API requires an `action` field:

- `virtualhost`

### Input 

#### Virtualhost

Return the list of all configured virtualhost, TLS certificates array and if vsftpd server is installed

Input example:
```json
{
  "action": "virtualhost"
}
```

### Output

#### Virtualhost

Output example:
```json
{
  "virtualhost": [
    {
      "PasswordValue": "",
      "ForceSslStatus": "disabled",
      "ServerNames": [
        "domain.com",
        "domain2.com"
      ],
      "status": "enabled",
      "name": "9f9e1ab8746cc26",
      "PasswordStatus": "disabled",
      "FtpStatus": "disabled",
      "FtpPassword": "",
      "type": "vhost",
      "Indexes": "disabled",
      "SslCertificate": "",
      "Description": "vhost1",
      "Access": "private"
    },
    {
      "FtpStatus": "disabled",
      "FtpPassword": "",
      "name": "default",
      "type": "vhost",
      "Description": "Default virtual host"
    }
  ],
  "vsftpd": 1,
  "certificates": [
    "/etc/pki/tls/certs/NSRV.crt"
  ]
}
```

## Validate

The validate API requires an `action` field. Valid `action` are :

- `create`
- `edit`
- `delete`

Constraint are :

- `PasswordStatus` : 'enabled' or 'disabled'
- `PasswordValue`: anything
- `ServerNames`: Must be a valid hostname array, one hostname is a mandatory
- `status`: 'enabled' or 'disabled'
- `name`: random string created by the UI, must not be an existing key name
- `FtpStatus`: 'enabled' or 'disabled'
- `FtpPassword`: anything
- `Indexes`: 'enabled' or 'disabled'
- `SslCertificate`: empty or path to the certificate file
- `Description`: anything
- `Access`: 'private' or 'public'

### Input

#### Create

Create the key in the database, the key name must not be already existing.

Example:
```json
{
    "action":"create",
    "virtualhost":{
        "name":"9f9e1ab8746cc26",
        "Description":"vhost1",
        "ServerNames":["domain.com","domain2.com"],
        "Access":"private",
        "PasswordStatus":"disabled",
        "PasswordValue":"",
        "ForceSslStatus":"disabled",
        "Indexes":"disabled",
        "FtpStatus":"disabled",
        "FtpPassword":"",
        "SslCertificate":"",
        "status":"enabled"
    }
}
```

#### Edit

Same input as `create` of validate API.

#### Delete

delete the given virtualhost
Example:
```json
{
    "action":"delete",
    "virtualhost":{
        "name":"9f9e1ab8746cc26"
    }
}
```

## Update

Same input from validate API.

You can disable a virtualhost by the action `toggle-lock`

### Input

#### Toggle-lock

Example:
```json
{
    "action":"toggle-lock",
    "virtualhost":{
        "name":"9f9e1ab8746cc26"}
}
```