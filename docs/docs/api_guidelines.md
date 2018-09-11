# Design guidelines

Each cockpit module has its own helpers implementing a set API to read and write the configuration and to execute actions. 
All helpers are saved inside `/usr/libexec/nethserver/api/<controller_name>/` directory.

Each helper:

* must be an executable file, it can be written in any language depending on the task
  Example: `/usr/libexec/nethserver/system-openssh/read`.
* uses JSON format for input and output; the JSON can must be read as input from STDIN and printed to STDOUT
* can use other helpers to execute multiple actions, the helpers can be placed in the same directory (eg. `/usr/libexec/nethserver/openssh/help1-read`)

APIs should implement classical CRUD operations, plus a validation helper:

* [create](#create)
* [read](#read)
* [update](#update)
* [delete](#delete)
* [validate](#validate)

None of the above action is mandatory.


### create

Usually used when managing tables, it create a new record and apply the configuration.

### read

### update

### delete

### validate

