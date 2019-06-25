## virtualhosts

API to read, validate and save  virtualhost settings to the vhosts database

### Input

Invocation example:

#### Read output in a json format all vhost type from the vhosts database

```bash
echo '{"action":"virtualhost"}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/virtualhost/read | jq
```

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

#### Validate the input before to be saved

valid values are : 

- `PasswordStatus` : 'enabled' or 'disabled'
- `PasswordValue`: anything
- `ServerNames`: Must be a valid hostname array, one hostname is a mandatory
- `status`: 'enabled' or 'disabled'
- `name`: random string created by the UI
- `FtpStatus`: 'enabled' or 'disabled'
- `FtpPassword`: anything
- `Indexes`: 'enabled' or 'disabled'
- `SslCertificate`: empty or path to the cert file
- `Description`: anything
- `Access`: 'private' or 'public'


```bash
echo '{"action":"edit","virtualhost":{"name":"9f9e1ab8746cc26","Description":"vhost1","ServerNames":["domain.com","domain2.com"],"Access":"private","PasswordStatus":"disabled","PasswordValue":"","ForceSslStatus":"disabled","Indexes":"disabled","FtpStatus":"disabled","FtpPassword":"","SslCertificate":"","status":"enabled"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/virtualhost/update | jq
```

#### Update the input once validated to vhosts database

For the creation, `"action":"create"` is used, `"action":"edit"` for all modifications after

```bash
echo '{"action":"edit","virtualhost":{"name":"9f9e1ab8746cc26","Description":"vhost1","ServerNames":["domain.com","domain2.com"],"Access":"private","PasswordStatus":"disabled","PasswordValue":"","ForceSslStatus":"disabled","Indexes":"disabled","FtpStatus":"disabled","FtpPassword":"","SslCertificate":"","status":"enabled"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/virtualhost/update | jq
```

#### Delete the virtualhost

```bash
echo '{"action":"delete","virtualhost":{"name":"9f9e1ab8746cc26"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/virtualhost/update | jq
```