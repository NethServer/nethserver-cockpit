# system-backup

Manage configuration and data backup.

## read

### Input

The read API requires an action field.
Valid actions:

- `backup-info`
- `list-disks`
- `last-log`
- `running-info`
- `check-backup-config`

Example:
```json
{
  "action": "list-disks"
}
```

#### backup-info

Return status and configuration of all backups.

Example:
```json
{
  "action": "backup-info"
}
```

#### list-disks

List attached disks which can be used for the backup.

Example:
```json
{
  "action": "list-disks"
}
```

#### last-log

Return the content of most recent log of the given log.
The `name` field must contain the backup name.

Example:
```json
{
  "action": "last-log",
  "name": "local119"
}
```

#### running-info

Check if there are backups running in background.

Example:
```json
{
  "action": "running-info"
}
```

#### check-backup-config

Check if the backup to be restored needs network remapping and if the machine must be register
before performing the restore.

The `data` backup can contain multiple information based on the `mode` field.
The `mode` field can be:

- `url`: retrieve the backup from given url.
   The `data` field contains a valid HTTP url.
- `file`: retrieve the backup from the uploaded file.
   The `data` field contains the uploaded file in base64 format.
- `backup`: retrieve the backup from local configuration backup history.
   The `data` field contains the name of the backup, like `c00`.

Example:
```json
{
  "action": "restore-backup-config",
  "mode": "backup",
  "data": "c00"
}
```


### Output

#### backup-info

The output is composed by `configuration` and `status` fields.
Both fields contain `backup-data` and `backup-config` fields.

The `ready` field is set to 1 if the backup is configured and ready to be executed.

Output example
```json
{
  "status": {
    "backup-config": [
      ...
      {
        "push_ts": 1539015800,
        "original_ts": 1539015799,
        "disk_ts": 1539015800,
        "description": "@18:23",
        "size": 31264,
        "Release": "final",
        "Version": "7.5.1804",
        "type": "cron",
        "id": "c02",
        "ProductName": "NethServer"
      },
      ...
    ],
    "backup-data": [
      ...
      {
        "id": "local119sftp",
        "log": "/var/log/backup/backup-local119sftp-201807050800.log",
        "last-run": 1539088300,
        "result": "success",
        "destination": {
          "used": 2472765161472,
          "percentage": 83,
          "total": 2948785504256
        }
      }
      ...
    ]
  },
  "configuration": {
    "backup-config": {
      "HistoryLength": "3"
    },
    "backup-data": {
      "backups": [
        ...
        {
          "custom-excludes": [],
          "props": {
            "SftpDirectory": "/mnt/local119sftp",
            "NotifyFrom": "",
            "VFSType": "sftp",
            "SftpHost": "192.168.1.119",
            "status": "disabled",
            "NotifyTo": "root@localhost",
            "CleanupOlderThan": "default",
            "SftpPort": "22",
            "Notify": "error",
            "SftpUser": "root",
            "type": "rsync",
            "BackupTime": "0 8 * * *"
          },
          "custom-includes": [
            "/root"
          ],
          "name": "local119sftp",
          "ready": 1,
          "type": "backup"
        }
        ...
      ],
      "defaults": {
        "IncludeLogs": "enabled",
        "custom-excludes": [],
        "custom-includes": [
          ...
          "/var/spool/anacron/cron.daily"
          ...
        ],
        "excludes": [
          ...
          "/var/lib/nethserver/db",
          ...
        ],
        "includes": [
          ...
          "/var/spool/anacron/cron.daily",
          ...
        ]
      }
    }
  }
}

```

Fields explanation for `status` section:

- `backup-config`: list of all available configuration backups
- `backup-data`: list of all executed data backup, `result` field can be `success`, `fail` or `unknown`


Fields explanation for `configuration` section:

- `backup-config`: contains only `HistoryLength`, number of configuration backups to be kept
- `backup-data`: contains 2 fields

    - `backups`: list of esmith records from `backups` database, extra fields `custom-excludes` and `custom-includes`
      contains the list of exclude and include from `/etc/backup-data/<backup_name>.exclude` and `/etc/backup-data/<backup_name>.include`

    - `defaults`: list of `custom-excludes`, `custom-includes`, `excludes`, `includes` common to all backups

#### list-disks

List all disks without a mounted partition.
If the disk alredy has a formatted partition, the `formatted` flag is set to 1, othwerise is set to 0.

Example:
```json
[
  {
    "formatted": 1,
    "model": "Flash Disk",
    "name": "sdb",
    "partitions": [
      {
        "label": "backup",
        "fstype": "ext3",
        "size": "2011426304"
      }
    ],
    "size": "2013265920",
    "vendor": "Generic"
  }
]
```

#### last-log

Example:
```json
{
  "data": "Backup: local119\nBackup started at ...."
}
```

#### running-info

It indicates if there are background jobs (restore-data or backup-data) started by the UI.

Example:
```json
{
  "restore-data": 0,
  "backup-data": 1
}
```


#### check-backup-config

The `remap` field is set to `1` if remap is needed, `0` otherwise.
The `current` field contains the list of ethernet interfaces present inside the system,
while `restore` field contains the list of ethernet interfaces from the backup.
The `valid` field is set to `1` if the machine doesn't require registration, `0` otherwise.

Example:
```json
{
  "remap": 1,
  "current": [
    {
      "nslabel": "",
      "name": "enp0s3",
      "role": "bridged",
      "ipaddr": ""
    }
  ],
  "restore": [
    {
      "nslabel": "",
      "name": "eth0",
      "role": "green",
      "ipaddr": "1.2.3.4"
    }
  ],
  valid: 1
}
```

## validate

### Constraints

The request must contain an `action` field. Valid actions are:

- `create-backup-data`
- `update-backup-data`
- `update-backup-config`
- `sftp-credentials`
- `b2-credentials`
- `s3-credentials`
- `nfs-credentials`
- `cifs-credentials`
- `webdav-credentials`
- `disk-access`

Constraints for `create-backup-data`:

- name: should be a unique simple identifier like a unix username
- status and IncludeLogs: can be `enabled` or `disabled`
- VFSType: can be `nfs`, `cifs`, `usb`, `b2`, `s3`, `sftp`
- engine: can be `restic`, `duplicity` or `rsync`
- Notify: can be `error`, `always` or `never`
- BackupTime: should be non-empty, a valid time for crontab (only limited validation has been implemented)
- Prune (only if engine is `restic`): can be `always` or a day of week number between 0 (Sunday) and 7 (Saturday)
- Type (only if engine is `duplicity`): can be `full` or `incremental`
- FullDay (only if engine is `duplicity`): day of week number between 0 (Sunday) and 7 (Saturday)
- VolSize (only if engine is `duplicity`): must be a number greater than 1
- CleanupOlderThan: can be `never`, `7D`, `14D`, `28D`, `56D`, `168D`, `364D`
- USBLabel (only if VFSType is `usb`): not empty
- SMBShare (only if VFSType is `cifs`): not empty
- SMBHost (only if VFSType is `cifs`): an IP or a host name
- SMBLogin, SMBPassword (only if VFSType is `cifs`): anything
- NFSShare (only if VFSType is `nfs): not empty
- NFSHost (only if VFSType is `nfs`): an IP or a host name
- SftpDirectory, SftpUser, SftpPassword (only if VFSType is `sftp`): not empty
- SftpHost (only if VFSType is `sftp`): an IP or a host name
- SftpPort (only if VFSType is `sftp`): TCP port number
- S3AccessKey, S3Bucket, S3SecretKey, S3Host (only if VFSType is `s3`): not empty
- B2AccountId, B2AccountKey, B2Bucket (only if VFSType is `b3`): not empty

Constraints for `update-backup-data`:

- same constraints from `create-backup`, but the `name` must be an existing record

Constraints for `update-backup-config`:

- HistoryLength: integer between 1 and 32

Constraints for `sftp-credentials`

- SftpDirectory, SftpUser, SftpPassword, SftpHost, SftpPort: not empty

Constraints for `b2-credentials`:

- B2AccountId, B2AccountKey, B2Bucket: not empty

Constraints for `s3-credentials`:

- 3AccessKey, S3Bucket, S3SecretKey, S3Host: not empty

Constraints for `nfs-credentials`:

- NFSShare: not empty
- NFSHost: an IP or a host name

Constraints for `cifs-credentials`:

- SMBShare: not empty
- SMBHost: an IP or a host name
- SMBLogin, SMBPassword: anything

Constraints for `webdav-credentials`:

- WebDAVUrl: not empty
- WebDAVLogin, WebDAVPassword: anything

Constraints for `disk-access`:

- USBLabel: not empty

### Input

#### create-backup-data

Example:
```json
{
  "action": "create-backup",
  "name": "test",
  "engine": "duplicity",
  "status": "enabled",
  "Notify": "error",
  "IncludeLogs": "disabled",
  "BackupTime": "5 0 * 8 *",
  "VFSType": "nfs",
  "SMBShare": "mybackup",
  "SMBHost": "192.168.1.1",
  "SMBLogin": "mybackupuser",
  "SMBPassord": "password",
  "Type": "incremental",
  "FullDay": 0,
  "VolSize": 250,
  "CleanupOlderThan": "28D"
}
```

Invocation example with sftp and rsync:
```
echo '{"action":"create-backup-data","name":"test3","engine":"rsync","status":"enabled","Notify":"error","IncludeLogs":"disabled","BackupTime":"5 0 * 8 *","VFSType":"sftp","SftpHost":"192.168.5.229","SftpUser":"root","SftpPassword":"Nethesis,1234","SftpDirectory":"/tmp/test","SftpPort":22}' | /usr/libexec/nethserver/api/system-backup/create
```

#### update-backup-data

Same as create-backup-data

#### update-backup-config

Example:
```json
{
  "action": "update-backup-config",
  "HistoryLength": 4
}
```

#### sftp-credentials

Example:
```json
{
  "action": "sftp-credentials",
  "SftpHost": "my.remote.host",
  "SftpPort": 22,
  "SftpUser": "backupuser",
  "SftpPassword": "MyPassw0rd",
  "SftpDirectory": "/srv/backup"
}
```

#### b2-credentials

Example:
```json
{
  "action": "b2-credentials",
  "B2AccountId": "xxxxxxxxxxxxxxxxxxxxxxxxx",
  "B2AccountKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "B2Bucket": "mybackup"
}
```

#### s3-credentials

Example:
```json
{
  "action": "s3-credentials",
  "S3AccessKey": "xxxxxxxxxxxxxxxxxxxx",
  "S3Bucket": "mybackup",
  "S3SecretKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "S3Host": "s3.amazonaws.com"
}
```

#### nfs-credentials

Example:
```json
{
  "action": "nfs-credentials",
  "NFSHost": "192.168.1.1",
  "NFSShare": "/mybackup"
}
```

#### cifs-credentials

Example:
```json
{
  "action": "cifs-credentials",
  "SMBHost": "192.168.1.1",
  "SMBShare": "mybackup",
  "SMBLogin": "myuser",
  "SMBPassword": "mypass"
}
```

#### webdav-credentials

Example:
```json
{
  "action": "webdav-credentials",
  "WebDAVLogin": "myuser",
  "WebDAVPassword": "mypass",
  "WebDAVUrl": "https//nextcloud.nethserver.org/nextcloud/remote.php/webdav/"
}
```


#### disk-access

Example:
```json
{
  "action": "disk-access",
  "USBLabel": "backup"
}
```


## update

### update-backup-data

Use the same input from validate.

### update-backup-config

Use the same input from validate.

### backup-data-contents

Change include and execludes of all data backups.

Input example:
```json
{
  "action": "backup-data-contents",
  "custom-includes": [
    "file1",
    "file2"
  ],
  "custom-excludes": [
    "file1",
    "file2"
  ],
  "IncludeLogs": "enabled"
}
```

## create

### create-backup-data

Use the same input from validate.

## delete

Available actions are:

- `backup-config`
- `backup-data`

### backup-config

Delete the archive of given configuration backup.
The `name` field must contain the backup id.

Input example:
```json
{
    "action": "backup-config",
    "name": "c00"
}
```

### backup-data

Delete the configuration of given backup data.
The `name` field must contain the backup name.

Input example:
```json
{
    "action": "backup-data",
    "name": "mybackup"
}
```


## execute

This is a special API which executes system commands and displays the raw (non-JSON) output.

Available actions:

- `format-disk`
- `run-backup-data`
- `run-backup-config`
- `download-backup-config`
- `restore-backup-config`
- `restore-backup-data`

### Input

#### format-disk

Format the given disk.
The `name` field must contain the disk name.

Example:
```json
{
  "action": "format-disk",
  "name": "sdb"
}
```

Invocation example:
```
echo '{"action":"format-disk","name":"sdb"}' | /usr/libexec/nethserver/api/system-backup/execute
```

#### run-backup-data

Execute the given backup.
The `name` field must contain the backup name.

Example:
```json
{
  "action": "run-backup-data",
  "name": "mybackup"
}
```

#### run-backup-config

Execute a configuration backup.
The `name` field should contain a description for the backup; the field is mandatory but can be empty.

Example:
```json
{
  "action": "run-backup-config",
  "name": "mybackup"
}
```

#### download-backup-config

Download the selected configuration backup from local history.
The `name` field should contain the name of the backup.

Example:
```json
{
  "action": "download-backup-config",
  "name": "c00"
}
```

#### restore-backup-config

Execute a configuration restore.
The `InstallPackages` field can be `enabled` or `disabled`.

The `data` backup can contain multiple information based on the `mode` field.
The `mode` field can be:

- `url`: retrieve the backup from given url.
   The `data` field contains a valid HTTP url.
- `file`: retrieve the backup from the uploaded file.
   The `data` field contains the uploaded file in base64 format.
- `backup`: retrieve the backup from local configuration backup history.
   The `data` field contains the name of the backup, like `c00`.

The `remap` field can contain a map of network interfaces to remap at the end of the restore.

Example:
```json
{
  "action": "restore-backup-config",
  "InstallPackages": "enabled",
  "mode": "backup",
  "remap": { "eth0" : "enp0s1" }
  "data": "c00"
}
```

#### restore-backup-data

Execute a data restore in background using a systemd unit.
The `name` field should contain the name of data backup to restore.

Example:
```json
{
  "action": "restore-backup-data",
  "name": "mybackup"
}
```

### Output

#### format-disk

Raw output from paritioning and formatting tools.

#### run-backup-data

No relevant output. The backup is started using a systemd transient unit.

#### run-backup-config

No output. 

#### restore-backup-config

Mimic event output. 

#### restore-backup-data

No output. 
