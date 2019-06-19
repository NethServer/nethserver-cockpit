## Dashboard

### Input

Available query sections

- `live`: rpm versions of the installed Lamp stack and number of the vhost/proxypass created
- `apacheStatus`: statistics on the apache service

The input query format is:

```json
echo '{"action":"live"}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/dashboard/read | jq

echo '{"action":"apacheStatus"}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/dashboard/read | jq
```

### Output

The output contains the queried sections. Possible keys are:

- `live`

detection of databases and php rpm (from nethserver integration of software collection)
detection if nethserver-httpd-virtualhosts is installed (0 or 1)

```json
{
  "versions": {
    "database_SCL": {
      "rh-postgresql94": "9.4.14"
    },
    "default": {
      "php": "5.4.16",
      "httpd": "2.4.6",
      "mysqld": "5.5.60-MariaDB"
    },
    "php_SCL": {
      "rh-php72-php-fpm": "7.2.10",
      "rh-php71-php-fpm": "7.1.8"
    }
  },
  "packages": {
    "virtualhost": 1
  },
  "statistics": {
    "ProxyPass": 0,
    "VhostReverse": 2,
    "virtualhosts": 4
  },
  "services": {
    "php": 1,
    "rh-php72-php-fpm": 1,
    "postgresql": 0,
    "rh-php71-php-fpm": 1,
    "rh-postgresql94-postgresql": 1,
    "httpd": 1,
    "mysqld": 1
  }
}
```

- `apacheSatus`

Statistics on the apache service based on Apache mod_status

```json
{
  "BytesPerReq": "1764.43",
  "Total_kbytes": "448",
  "ReqPerSec": ".00464195",
  "Uptime": "56011",
  "statistics": {
    "RunningWorkers": "1",
    "SpareWorkers": 248,
    "IdleWorkers": "7"
  },
  "TotalAccess": "260",
  "BytesPerSec": "8.19039"
}
```


## virtualhosts

API to read, validate and save  virtualhost settings to the vhosts database

### Input

Invocation example:

- `read` output in a json format all vhost type from the vhosts database

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
        "tutu.com",
        "plop.be"
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

- `validate` the input before to be saved

```bash
echo '{"action":"edit","virtualhost":{"name":"9f9e1ab8746cc26","Description":"vhost1","ServerNames":["tutu.com","plop.be"],"Access":"private","PasswordStatus":"disabled","PasswordValue":"","ForceSslStatus":"disabled","Indexes":"disabled","FtpStatus":"disabled","FtpPassword":"","SslCertificate":"","status":"enabled"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/virtualhost/update | jq
```

- `update` the input once validated to vhosts database

For the creation, `"action":"create"` is used, `"action":"edit"` for all modifications after

```bash
echo '{"action":"edit","virtualhost":{"name":"9f9e1ab8746cc26","Description":"vhost1","ServerNames":["tutu.com","plop.be"],"Access":"private","PasswordStatus":"disabled","PasswordValue":"","ForceSslStatus":"disabled","Indexes":"disabled","FtpStatus":"disabled","FtpPassword":"","SslCertificate":"","status":"enabled"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/virtualhost/update | jq
```

- `delete` the virtualhost

```bash
echo '{"action":"delete","virtualhost":{"name":"9f9e1ab8746cc26","Description":"vhost1","ServerNames":["tutu.com","plop.be"],"Access":"private","PasswordStatus":"disabled","PasswordValue":"","ForceSslStatus":"disabled","Indexes":"disabled","FtpStatus":"disabled","FtpPassword":"","SslCertificate":"","status":"enabled"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/virtualhost/update | jq
```

## reverse proxy

API to read, validate and save  reverse proxy settings to the proxypass database

### Input

Invocation example:

- `read` output in a json format all proxypass (ProxyPass and VhostReverse) type from the proxypass database

```bash
echo '{"action":"virtualhost"}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/virtualhost/read | jq
```
To differentiate the two types of reverse proxy, the name starts by a `/` for a ProxyPass (not saved in esmith database)

```json
{
  "certificates": [
    "/etc/pki/tls/certs/NSRV.crt"
  ],
  "proxypass": [
    {
      "HTTP": "no",
      "Target": "http://plop.com",
      "CertVerification": "no",
      "name": "toto.com",
      "ValidFrom": "",
      "HTTPS": "yes",
      "PreserveHost": "yes",
      "type": "VhostReverse",
      "SslCertificate": "",
      "Description": "reverse2"
    },
    {
      "ValidFrom": "",
      "HTTP": "no",
      "Target": "http://toto.com",
      "HTTPS": "yes",
      "name": "/plop",
      "type": "ProxyPass",
      "Description": "reverse3"
    }
  ]
}
```

- `validate` the input before to be saved

```bash
 echo '{"action":"edit","proxypass":{"name":"toto.com","Description":"reverse2","Target":"http://plop.com","HTTP":"no","HTTPS":"yes","PreserveHost":"yes","SslCertificate":"","ValidFrom":[""],"CertVerification":"no","type":"VhostReverse"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/validate | jq
```
```bash
 echo '{"action":"edit","proxypass":{"name":"plop","Description":"reverse3","Target":"http://toto.com","HTTP":"no","HTTPS":"yes","PreserveHost":"","SslCertificate":"","ValidFrom":[""],"CertVerification":"","type":"ProxyPass"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/validate | jq
```

- `update` the input once validated to proxypass database

For the creation, `"action":"create"` is used, `"action":"edit"` for all modifications after

```bash
 echo '{"action":"edit","proxypass":{"name":"toto.com","Description":"reverse2","Target":"http://plop.com","HTTP":"no","HTTPS":"yes","PreserveHost":"yes","SslCertificate":"","ValidFrom":[""],"CertVerification":"no","type":"VhostReverse"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/update | jq
```

```bash
 echo '{"action":"edit","proxypass":{"name":"plop","Description":"vhost3","Target":"http://toto.com","HTTP":"no","HTTPS":"yes","PreserveHost":"","SslCertificate":"","ValidFrom":[""],"CertVerification":"","type":"ProxyPass"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/update | jq
```

- `delete` the reverse proxy

```bash
 echo '{"action":"delete","proxypass":{"name":"plop","Description":"vhost3","Target":"http://toto.com","HTTP":"no","HTTPS":"yes","PreserveHost":"","SslCertificate":"","ValidFrom":[""],"CertVerification":"","type":"ProxyPass"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/update | jq
 ```
