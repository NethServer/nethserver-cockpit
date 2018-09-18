# system-apps

Return installed NethServer apps (or modules).

The response is composed by:

-   Name
-   Id (rpm package name)
-   Description, Author, Summary, License, Tags, Bugs
-   URL
-   Repository reference
-   Version
-   Icon

## read

List all available applications.

### Input

If no input has been provided, the helper will return the list
of all available applications.

To retrieve a application, pass the `name` parameter to the read helper.

Example:

```bash
echo '{"name":"nethserver-cockpit-empty"}' | ./read
```

### Output

Example:

```json
[
    {
        "description": "Very very very very very long description of NethServer Cockpit Empty",
        "license": "GPL-3.0",
        "tags": ["tag1", "tag2", "tag3"],
        "url": "nethserver-cockpit-empty",
        "author": {
            "url": "https://github.com/NethServer/nethserver-cockpit-empty",
            "name": "Author's name of NethServer Cockpit Empty",
            "email": "Author's email of NethServer Cockpit Empty"
        },
        "bugs": {
            "url": "https://github.com/NethServer/dev/issues"
        },
        "summary": "Short description of NethServer Cockpit Empty",
        "provides": ["nethserver-cockpit-empty"],
        "release": {
            "version": "1.0.0"
        },
        "icon": "icon.png",
        "homepage": "https://github.com/NethServer/nethserver-cockpit-empty",
        "id": "nethserver-cockpit-empty",
        "name": "NethServer Cockpit Empty"
    },
    ...
]
```
