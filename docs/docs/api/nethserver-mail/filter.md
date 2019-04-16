# filter

Manage antispam and antivirus filter.

## read

The read API requires and `action` field.
Valid actions are:

- `stats`
- `configuration`

### Input

#### stats

It requires also a `timespan` field.
Valid values for `timespan` are:

- `hourly`
- `daily`
- `weekly`
- `monthly`


Example:
```json
{
  "action": "stats",
  "timespan": "hourly"
}
```

#### configuration

Example:
```json
{
  "action": "configuration"
}
```

### Output

#### stats

Return rspmad statistics invoking `stat` and `stat` HTTP API.

Output example:
```json
{
  "info": {
    "version": "1.8.3",
    "learned": 0,
    "clean": 1,
    "scanned": 1,
    "auth": "ok",
    "greylist": 0,
    "read_only": false,
    "uptime": 6633,
    "probable": 0,
    "config_id": "thdng6ppt1d4paeuq4rtboqdbakcjy7mcnow44oakzq6qstm1ipk9ehu8dg87ifp6dhyoi6txfm4c3rt8n8xwnkkwcgnfaiqe57ab1b",
    "reject": 0,
    "soft_reject": 0
  },
  "counters": {
    "bytes_allocated": 19572392,
    "actions": {
      "rewrite subject": 0,
      "add header": 0,
      "soft reject": 0,
      "greylist": 0,
      "no action": 1,
      "reject": 0
    },
    "connections": 0,
    "spam_count": 0,
    "learned": 0,
    "fragmented": 0,
    "scanned": 1,
    "ham_count": 1,
    "read_only": false,
    "chunks_oversized": 1,
    "chunks_allocated": 122,
    "total_learns": 0,
    "pools_freed": 15,
    "fuzzy_hashes": {
      "rspamd.com": 487938756,
      "local": 0
    },
    "statfiles": [
      {
        "symbol": "BAYES_SPAM",
        "users": 0,
        "total": 0,
        "size": 0,
        "revision": 0,
        "languages": 0,
        "used": 0,
        "type": "redis"
      },
      {
        "symbol": "BAYES_HAM",
        "users": 0,
        "total": 0,
        "size": 0,
        "revision": 0,
        "languages": 0,
        "used": 0,
        "type": "redis"
      }
    ],
    "chunks_freed": 0,
    "shared_chunks_allocated": 17,
    "control_connections": 11,
    "pools_allocated": 47
  }
}
```

#### configuration

Display configuration for `rspmad` key from `configuration` database.

Example:
```json
{
  "props": {
    "SpamTag2Level": "6",
    "SenderBlackList": [
      "baduser@domain.org"
    ],
    "SpamGreyLevel": "",
    "status": "enabled",
    "RecipientWhiteList": [],
    "Password": "xxxxxxxxxxxxxxxx",
    "VirusAction": "reject",
    "SpamKillLevel": "15",
    "VirusCheckStatus": "enabled",
    "BlockAttachmentCustomStatus": "disabled",
    "SpamSubjectPrefixString": "***SPAM***",
    "VirusScanSize": "20000000",
    "BlockAttachmentCustomList": [
      "doc",
      "odt"
    ],
    "VirusScanOnlyAttachment": "false",
    "BlockAttachmentStatus": "enabled",
    "SpamSubjectPrefixStatus": "disabled",
    "type": "service",
    "SpamCheckStatus": "enabled",
    "BlockAttachmentClassList": [
      "Exec"
    ],
    "SenderWhiteList": [
      "good@nethserver.org"
    ]
  },
  "name": "rspamd",
  "type": "service"
}
```

## validate

The validate API requires and `action` field.
Valid actions are:

- `filter`
- `rule`

### Constraints

Constraints for action `rule`:

- value: can be a mail address or a domain

Constraints for action `filter`:

- VirusCheckStatus, SpamCheckStatus, BlockAttachmentStatus, SpamSubjectPrefixStatus, BlockAttachmentCustomStatus: can be enabled or disabled
- VirusScanOnlyAttachment: can be true or false
- SpamSubjectPrefixString: lenght between 1 and 16
- SpamKillLevel: between 0 and 25
- SpamTag2Level: between 0 and 25, less then SpamKillLevel
- SpamGreyLevel: if set, between 0 and 25, less then SpamTag2Level
- BlockAttachmentCustomList: a list of file extensions
- BlockAttachmentClassList: a list containing values between 'Arch' and 'Exec'

### Input

#### filter

It takes the same format used as output from read API.

Ignored fields:

- props.Password
- name
- type

Example:
```json
{
  "props": {
    "SpamTag2Level": "6",
    "SenderBlackList": [],
    "SpamGreyLevel": "2",
    "status": "disabled",
    "RecipientWhiteList": [],
    "VirusAction": "reject",
    "SpamKillLevel": "20",
    "VirusCheckStatus": "enabled",
    "BlockAttachmentCustomStatus": "disabled",
    "SpamSubjectPrefixString": "***SPAM***",
    "VirusScanSize": "20000000",
    "BlockAttachmentCustomList": [
      "doc",
      "odt"
    ],
    "VirusScanOnlyAttachment": "false",
    "BlockAttachmentStatus": "enabled",
    "SpamSubjectPrefixStatus": "disabled",
    "type": "service",
    "SpamCheckStatus": "enabled",
    "BlockAttachmentClassList": [
      "Exec"
    ],
    "SenderWhiteList": [
      "a@a.com"
    ]
  },
  "name": "rspamd",
  "type": "service",
  "action": "filter"
}
```

#### rule


Validate a single whitelist/blacklist rule.

The `value` field must contains the mail or domain to be validated.

Example:
```json
{
  "action": "rule",
  "value": "test@mail.org"
}
```

## update

Same input as validate.
