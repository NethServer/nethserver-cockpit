# system-docs

Retrieve online documentation and prepare it for the UI.

The API assumes the documentation is generated from https://github.com/NethServer/docs repository and it's
available on a public URL.

The complete URL is calculated using two variables:
- `base_url`: default is `https://docs.nethserver.org`
- `version`: default is `latest`

To customize the URL, just create a ini file named `/etc/nethserver/cockpit-doc.ini`.
The ini file must contain both `base_url` and `version` options.

Example of a custom `/etc/nethserver/cockpit-doc.ini` file:
```
base_url = "https://mydocs.mydomain.org"
version = "latest"
```

## read

### Input

There are 3 mandatory fields:

- chapter
- nfs
- language

Example:
```json
{
  "chapter": "backup",
  "section": "nfs",
  "language": "en"
}
```


### Output

Output fields:

- link: link to the external documentation

```json
{
  "link": "https://docs.nethserver.org/en/latest/backup.html#nfs"
}
```

