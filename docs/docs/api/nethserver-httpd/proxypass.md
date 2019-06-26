# proxypass

Manage reverse proxy for the Apache server

## Read

The read API requires an `action` field:

- `proxypass`

### Input 

#### Proxypass

Return the list of all configured reverse proxy and the array of the TLS certificates

Input example:
```json
{
  "action": "proxypass"
}
```

### Output

#### Proxypass

Output example:
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
      "ValidFrom": ["1.1.1.0/16","10.10.10.0/24"],
      "HTTPS": "yes",
      "PreserveHost": "yes",
      "type": "VhostReverse",
      "SslCertificate": "",
      "Description": "reverse2"
    },
    {
      "ValidFrom": ["1.1.1.0/16","10.10.10.0/24"],
      "HTTP": "no",
      "Target": "http://domain.com",
      "HTTPS": "yes",
      "name": "reverse",
      "type": "ProxyPass",
      "Description": "reverse3"
    }
  ]
}
```

## Validate

The validate API requires an `action` field. Valid `action` are :

- `create`
- `edit`
- `delete`

Constraint are :

- `HTTP` : 'yes' or 'no'
- `HTTPS` : 'yes' or 'no'
- `Target`: a valid url starting by 'http://' or 'https://'
- `CertVerification`: 'yes' or 'no'
- `name`: a valid hostname
- `ValidFrom`: valid CIDR array or empty
- `PreserveHost`: 'yes' or 'no'
- `SslCertificate`: empty or path to the certificate file
- `Description`: anything

To differentiate the two types of reverse proxy in the user Interface, the name starts by a `/` for a ProxyPass (only valid in `name` field of UI, therefore not saved in esmith database)


### Input

#### Create

Create the key in the database, the key name must not be already existing.

Example:

- VhostReverse type
```json
{
    "action":"create",
    "proxypass":{
        "name":"domain.com",
        "Description":"reverse2",
        "Target":"http://plop.com",
        "HTTP":"no",
        "HTTPS":"yes",
        "PreserveHost":"yes",
        "SslCertificate":"",
        "ValidFrom":["1.1.1.0/16","10.10.10.0/24"],
        "CertVerification":"no",
        "type":"VhostReverse"}
}
```

- ProxyPass type
```json
{
    "action":"create",
    "proxypass":{
        "name":"reverse",
        "Description":"reverse3",
        "Target":"http://domain.com",
        "HTTP":"no",
        "HTTPS":"yes",
        "PreserveHost":"yes",
        "SslCertificate":"",
        "ValidFrom":["1.1.1.0/16","10.10.10.0/24"],
        "CertVerification":"",
        "type":"ProxyPass"}
}
```
#### Edit

Same input as `create` of validate API.

#### Delete

delete the given reverse proxy

Example:
```json
{
    "action":"delete",
    "proxypass":{
        "name":"reverse"
    }
}
```

## update

Same input from validate API.
