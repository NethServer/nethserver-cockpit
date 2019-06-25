# feature

Check if a feature is installed.

## read

The API takes a `name` field with the name of the feature to check.

Valid names are:

- `virtualhosts`

#### Input

Input example:
```json
{
  "name": "virtualhosts"
}
```

### Output

Fields:

- `installed`: it's `true` if the feature is installed, `false` otherwise
- `packages:` list of packages to install to enable the function

Output example:
```json
{
  "packages": [
    "nethserver-httpd-virtualhosts"
  ],
  "installed": true
}
```

## update

If not already installed, it installs all packages to enable the feature.

Input example:
```json
{
  "name": "virtualhosts"
}
```

The output is a success message or output from `pkgaction` command.
