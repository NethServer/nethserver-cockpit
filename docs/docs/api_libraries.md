# Helper libraries

The `nethserver-cockpit` RPM includes some simple libraries to ease the development of helpers.
Usage of such libraries is not mandatory.

## PHP

This library includes some classes from NethGUI framework to speed up the porting of existing code.
PHP helper library is useful to quickly adapt validation code from old Server Manager.

Include the library:
```php
<?php
require_once("/usr/libexec/nethserver/api/lib/Helpers.php");
```

### Available functions

**readInput**

Read the JSON input and return a named array.
Example:
```php
<?php
$data = readInput();
print $data['name'];
```

**EsmithDatabase**

Access the Esmith database.
Example:
```php
<?php
$db = new EsmithDatabase('configuration');
$policy = $db->getProp('tls', 'policy');
$tls =  $db->getKey('tls');
$records = $db->getAll();
```


**LegacyValidator**

Interface to old validator code. See below.

### Legacy validator

When using the LegacyValidator class, you should follow some rules which ease
the cut&paste from legacy code.
General workflow:

1. Include the helper
2. Read the input
3. Create the validator (calling it `$v`)
4. Copy all `declareParameter` invocations from the old Module
   Parameters with ANYTHING validator could be omitted
5. Replace all call to `$this` with `$v`
6. Make sure the first parameter of `declareParameter` is the name of the prop inside the db
7. (Optional) Remove the 3rd argument from `declareParameter` calls
8. If present, copy validate function.
   It should be enough to copy the code inside `if ($this->getRequest()->isMutation()) {` condition.
   Replace all `$this` with `$v`
9. Validate the input calling `$v->validate()`
   Invoke `success()` method if `validate()` returns true
   Otherwise invoke `error($v)` passing the validator object

Full example:
```php
<?php

# Include library
require_once("/usr/libexec/nethserver/api/lib/Helpers.php");

# Read input
$data = readInput();

# Create the validator
$v = new LegacyValidator($data['props']);

# Declare all parameters
$v->declareParameter('PasswordAuthentication', Validate::BOOLEAN);

# Validate the input
if ($v->validate()) {
    success();
} else {
    error($v);
}
```


## Perl

To write better code, always enable warnings and strict checks:
```perl
use warnings;
use strict;
```

Include the library:
```perl
require '/usr/libexec/nethserver/api/lib/helper_functions.pl';
```

### Available functions

**success**

Print a success JSON object and exit 0.

**error**

Print a JSON error and exit 1.
Takes 2 arguments:
 - the error type (default: GenericError)
 - a message (default "Generic error")

Example:
```perl
error("GenericError", "System message failure");
```

**readInput**

Read JSON input from STDIN
Exit with InvalidInput error if JSON can't be decoded.

Example:
```perl
my $data = readInput();
print $data->{'name'};
```



### General examples

Output `sshd` key in json output:
```perl
use JSON;
use esmith::db;
my $db = esmith::db->open("configuration");

print to_json($db->prepare_json('sshd'), {utf8 => 1, pretty => 0, allow_nonref => 1});
```

Alternative implementation:
```perl
use JSON;
use esmith::ConfigDB;
my $db = esmith::ConfigDB->open_ro();
my $record = $db->get('sshd');
my %props = $record->props;

print encode_json({ name=> $record->key, type=> $record->prop('type'), props => \%props});
```


## BASH

BASH is useful when writing simple helpers.

First, include the library:
```bash
. /usr/libexec/nethserver/api/lib/helper_functions
```

### Available functions

**success**

Print a success JSON object and exit 0.

**error**

Print a JSON error and exit 1.
Takes 2 arguments:

- the error type (default: GenericError)
- a message (default "Generic error")

Example:
```bash
error "GenericError" "System failure message"
```

**invalid_error**

Print an InvalidInput error and exit 1.


### General examples

Read JSON from STDIN and set the record:
```bash
cat /dev/stdin | /sbin/e-smith/config setjson - 2>/dev/null
```

Output `sshd` key in json output:
```bash
/sbin/e-smith/config getjson sshd
```
