# system-docs

Retrive online documentation and prepare it for the UI.

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
- data: if section has been found, contains the html section encoded using base64

```json
{
  "data": "PGRpdiBjb..........C9kaXY+",
  "link": "https://nethserver-docs-cockpit.readthedocs.io/en/latest/backup.html#nfs"
}
```

