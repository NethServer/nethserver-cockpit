# system-certificate

Manage system certificates.
Supported operations:

- list certificates
- show certificate content
- configure Let's Encrypt
- configure self-signed certificate
- set default certificate

## read 

List all available certificates.

### Input

If no input has been provided, the helper will return the list 
of all available certificates.

To retrieve a certificate, use:
```json
{
  "name": ""
}
```

### Output

#### List

Uses `/usr/libexec/nethserver/cert-list` helper.

Example:
```json
{
  "status": "",
  "configuration": {
    "/etc/pki/tls/certs/NSRV.crt": {
      "cn": "NethServer, O=Example Org, ST=SomeState, OU=Main",
      "file": "/etc/pki/tls/certs/NSRV.crt",
      "default": 1,
      "issuer": "NethServer, O=Example Org, ST=SomeState, OU=Main",
      "key": "/etc/pki/tls/private/NSRV.key",
      "chain": "",
      "expiration_t": 1795129200,
      "expired": 0
    }
  }
}
```

#### Certificate content

Uses `/usr/libexec/nethserver/pki-info` helper.

Output is base64 encoded:
```json
{
  "certificate": "Q2Vyd .... "
}
```

## validate

### Constraints

Validate 3 different actions:

- `lets-encrypt`
- `upload`
- `self-signed`

The action must be specified inside the JSON `action` field.

Example:
```json
{
  "action": "upload",
  ...
}
```

Constraints for `self-signed`:

- CountryCode: empty or 2 letters
- State, Locality, Organization, OrganizationalUnitName, CommonName: valid x509 fields
- EmailAddress: emptyr or valid mail address
- SubjectAltName: comma-separeted list of FQDNs

Constraints for `lets-encrypt`:

- LetsEncryptMail: empty or valid mail address
- LetsEncryptDomains: comma-separeted list of FQDNs
- Check all Let's Encrypt conditions are met

Constraints for `upload`:

- certificate: valid x509 certificate
- chain: valid x509 certificate
- key: valid key for running tlspolicy

### Input

#### self-signed

- `action` must be set to `self-signed`
- pki record in json format

Example:
```json
{
  "props": {
    "LetsEncryptMail": "",
    "SubjectAltName": "t1.test.net,t2.test.net",
    "KeyFile": "",
    "CrtFile": "",
    "State": "myState",
    "EmailAddress": "",
    "ChainFile": "",
    "Organization": "My company",
    "CertificateDuration": "3650",
    "Locality": "",
    "LetsEncryptDomains": "test.local.net",
    "CommonName": "",
    "LetsEncryptRenewDays": "30",
    "LetsEncrypt": "disabled",
    "CountryCode": "it",
    "OrganizationalUnitName": ""
  },
  "name": "pki",
  "type": "configuration",
  "action": "lets-encrypt"
}
```


#### lets-encrypt

- `action` must be set to `lets-encrypt`
- pki record in json format

Example:
```json
{
  "props": {
    "LetsEncryptMail": "",
    "SubjectAltName": "",
    "KeyFile": "",
    "CrtFile": "",
    "State": "",
    "EmailAddress": "",
    "ChainFile": "",
    "Organization": "",
    "CertificateDuration": "3650",
    "Locality": "",
    "LetsEncryptDomains": "test.local.net",
    "CommonName": "",
    "LetsEncryptRenewDays": "30",
    "LetsEncrypt": "disabled",
    "CountryCode": "it",
    "OrganizationalUnitName": ""
  },
  "name": "pki",
  "type": "configuration",
  "action": "lets-encrypt"
}
```

Warning: the UI shouldn't change the `LetsEncrypt` field.

#### upload

Format:

- `action` must be set to `upload`
- `name` is mandatory and set the name for the uploaded certs
- `certificate`, `key` and `chain` must contain base64 encoded data
- the `chain` field can be empty

```json
{
  "action": "upload",
  "files": {
    "name": "mycert",
    "certificate": "...",
    "key": "...",
    "chain": "..."
  }
}
```


## update

Available actions:

- `self-signed`
- `lets-encrypt`
- `upload`
- `set-default`

### self-signed, lets-encrypt, upload

Same input from validate.

### set-default

Same input from self-signed, but the UI *must* set at least `CrtFile` and `KeyFile`.
The `ChainFile` property is optional.
