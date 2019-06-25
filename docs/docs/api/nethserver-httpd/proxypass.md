## reverse proxy

API to read, validate and save  reverse proxy settings to the proxypass database

### Input

Invocation example:

#### Read output in a json format

 all proxypass (ProxyPass and VhostReverse) type from the proxypass database

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
      "name": "domain.com",
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
      "Target": "http://domain.com",
      "HTTPS": "yes",
      "name": "/reverse",
      "type": "ProxyPass",
      "Description": "reverse3"
    }
  ]
}
```

#### Validate the input before to be saved

valid values are : 

- `HTTP` : 'yes' or 'no'
- `HTTPS` : 'yes' or 'no'
- `Target`: a valid url starting by 'http://' or 'https://'
- `CertVerification`: 'yes' or 'no'
- `name`: a valid hostname for the type `VhostReverse` or starting by '/' for a `ProxyPass` type
- `ValidFrom`: valid CIDR array or empty
- `PreserveHost`: 'yes' or 'no'
- `SslCertificate`: empty or path to the certificate file
- `Description`: anything


```bash
 echo '{"action":"edit","proxypass":{"name":"domain.com","Description":"reverse2","Target":"http://plop.com","HTTP":"no","HTTPS":"yes","PreserveHost":"yes","SslCertificate":"","ValidFrom":["1.1.1.0/16","10.10.10.0/24"],"CertVerification":"no","type":"VhostReverse"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/validate | jq
```
```bash
 echo '{"action":"edit","proxypass":{"name":"reverse","Description":"reverse3","Target":"http://domain.com","HTTP":"no","HTTPS":"yes","PreserveHost":"","SslCertificate":"","ValidFrom":["1.1.1.0/16","10.10.10.0/24"],"CertVerification":"","type":"ProxyPass"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/validate | jq
```

#### Update the input once validated to proxypass database

For the creation, `"action":"create"` is used, `"action":"edit"` for all modifications after

```bash
 echo '{"action":"edit","proxypass":{"name":"domain.com","Description":"reverse2","Target":"http://plop.com","HTTP":"no","HTTPS":"yes","PreserveHost":"yes","SslCertificate":"","ValidFrom":["1.1.1.0/16","10.10.10.0/24"],"CertVerification":"no","type":"VhostReverse"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/update | jq
```

```bash
 echo '{"action":"edit","proxypass":{"name":"reverse","Description":"vhost3","Target":"http://domain.com","HTTP":"no","HTTPS":"yes","PreserveHost":"","SslCertificate":"","ValidFrom":["1.1.1.0/16","10.10.10.0/24"],"CertVerification":"","type":"ProxyPass"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/update | jq
```

#### Delete the reverse proxy

```bash
 echo '{"action":"delete","proxypass":{"name":"reverse"}}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/proxypass/update | jq
 ```
