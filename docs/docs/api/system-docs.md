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

```json
{
  "link": "https://nethserver-docs-cockpit.readthedocs.io/en/latest/backup.html#nfs"
}
```

