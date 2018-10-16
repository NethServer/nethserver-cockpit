# Design guidelines

Each cockpit module has its own helpers implementing a set API to read and write the configuration and to execute actions. 
All helpers are saved inside `/usr/libexec/nethserver/api/<controller_name>/` directory.

Each helper:

* must be an executable file, it can be written in any language depending on the task
  Example: `/usr/libexec/nethserver/system-openssh/read`.
* uses JSON format for input and output; the JSON can must be read as input from STDIN and printed to STDOUT
* can use other helpers to execute multiple actions, the helpers can be placed in the same directory (eg. `/usr/libexec/nethserver/openssh/help1-read`)

The JavaScript controller uses the `cockpit.spawn` method to communicate with the backend.
After spawning the process, the controller gather the standard output to track the task progress.

At the end, the process exit code will raise an error or a success.

Example:
```javascript
process = cockpit.spawn("/usr/libexec/nethserver/system-status/read", { ... }
```

## Methods

APIs should implement classical CRUD operations:

* [create](#create)
* [read](#read)
* [update](#update)
* [delete](#delete)

Extra operations:

* [validate](#validate)
* [execute](#execute)

None of the above action is mandatory.

### create

Create a new record and apply the configuration.
It's used to handle new records inside databases to mimic a table behavior.

The input should be a [JSON esmith record](api_protocol.md#esmith-db-records).

Example: [system-hosts](api/system-hosts.md#create).

### read

Read the current system status and configuration.
It should return an object with `system` and `configuration` field.

JSON format:
```json
{
  "status" : { ... }
  "configuration": { ...}
}
```

Example: [system-openssh](api/system-openssh.md#read).

### update

Update and existing record or a key inside the configuration database and apply the configuration.

Example: [system-openssh](api/system-openssh.md#update).

### delete

Delete and existing record and apply the configuration.

Example: [system-hosts](api/system-hosts.md#create).

### validate

Validate the given input.
If validation fail, raise a [validation error](api_protocol.md#validation) and exit 1.
Otherwise return a [success](api_protocol.md#success) and exit 0.

### execute

Execute a command in foreground or background.
This type of operation can return raw output from underlying system.

## Documentation

When creating new helpers, remember to write the related documentation.

1. Download the [template](https://raw.githubusercontent.com/NethServer/nethserver-cockpit/master/docs/docs/api_template.md) and edit it
2. Add the new document inside the [docs/docs/api](https://github.com/NethServer/nethserver-cockpit/tree/master/docs/docs/api) directory
3. Add the new document inside the [navigation menu](https://github.com/NethServer/nethserver-cockpit/blob/master/docs/mkdocs.yml#L15)

Try to respect the following rules:

- always use a correct header level
- add examples to you documentation
- enable syntax highlighting for code

See also [building documementation](build_doc.md).
