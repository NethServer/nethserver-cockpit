# system-certificate

Manage system certificates.
Supported operations:

- list certificates
- show certificate content
- configure Let's Encrypt
- configure self-signed certificate
- set default certificate

## read

### Input

It takes a mandatory `action` argument.

#### list

List all available certificates.

Example:
```json
{
  "action": "list"
}
```

#### info

To retrieve a certificate, pass the `name` parameter to the read helper.

Example:
```json
{
  "action": "info",
  "name":"/etc/pki/tls/certs/NSRV.crt"
}
```

### Output

#### list

Internally, the helper calls `/usr/libexec/nethserver/cert-list`.
Output current `pki` configuration and the list of existing certificates.

If some `pki` properties are empty, system defaults will be used to fill the returned object.

Example:
```json
{
  "status": "",
  "configuration": {
    "pki": {
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
        "LetsEncryptDomains": "",
        "CommonName": "",
        "LetsEncryptRenewDays": "30",
        "LetsEncrypt": "disabled",
        "CountryCode": "",
        "OrganizationalUnitName": ""
      },
      "name": "pki",
      "type": "configuration"
    },
    "certificates": [
      {
        "cn": "NethServer, O=Example Org, ST=SomeState, OU=Main",
        "file": "/etc/pki/tls/certs/NSRV.crt",
        "issuer": "NethServer, O=Example Org, ST=SomeState, OU=Main",
        "default": 1,
        "key": "/etc/pki/tls/private/NSRV.key",
        "chain": "",
        "expiration_t": 1795129200,
        "expired": 0
      }
    ]
  }
}
```

#### info

Internally, the helper calls `/usr/libexec/nethserver/pki-info`.

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
- EmailAddress: empty or valid mail address
- SubjectAltName: comma-separated list of FQDNs

Constraints for `lets-encrypt`:

- LetsEncryptMail: empty or valid mail address
- LetsEncryptDomains: comma-separated list of FQDNs
- LetsEncryptRenewDays: and integer greater than 10 and lower than 90
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
    "SubjectAltName": "t1.test.net,t2.test.net",
    "State": "myState",
    "EmailAddress": "",
    "Organization": "My company",
    "CertificateDuration": "3650",
    "Locality": "",
    "CommonName": "",
    "CountryCode": "it",
    "OrganizationalUnitName": ""
  },
  "action": "self-signed"
}
```

Invocation example:
```bash
echo '{"props":{"SubjectAltName":"t1.test.net,t2.test.net","State":"myState","EmailAddress":"","Organization":"My company","CertificateDuration":"3650","Locality":"","CommonName":"","CountryCode":"it","OrganizationalUnitName":"myoffice"},"action":"self-signed"}' | ./update
```

#### lets-encrypt

Manfatory fields:

- `action` must be set to `lets-encrypt`
- `LetsEncryptMail`
- `LetsEncryptDomains`
- `LetsEncryptRenewDays`

Example:
```json
{
  "props": {
    "LetsEncryptMail": "",
    "LetsEncryptDomains": "test.local.net",
    "LetsEncryptRenewDays": "30",
  },
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

### self-signed

Same input from validate.

### lets-encrypt

Same input from validate.

### upload

Same input from validate.

### set-default

Mandatory fields: `CrtFile`, `KeyFile` and `ChainFile`.
The `ChainFile` field can be empty.

Input example:
```json
{
  "action": "set-default",
  "props": {
    "KeyFile": "/etc/pki/tls/private/NSRV.key",
    "CrtFile": "/etc/pki/tls/certs/NSRV.crt",
    "ChainFile": ""
  }
}
```
