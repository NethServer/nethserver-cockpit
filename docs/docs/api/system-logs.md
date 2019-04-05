# system-logs

Read applications logs.

## execute

### Input

Each request must have an `action` field.
Valid actions are:

- `dump`: return the last x lines from one or more logs, equivalent to `tail -n xx <file>`
- `follow`: output the stream of one ore more logs, equivalent to `tail -f <file>`

#### dump

Required fields:

- `mode`: can be `systemd` or `files`
- `paths`: list of systemd units or absolute file paths
- `lines`: maximum lines to retrieve, if empty, default is 50

Optional fields:

- `filter`: if present and not empty, pipe the output to grep with the given filter

Example for `systemd` mode
```json
{
  "action": "dump",
  "mode": "systemd",
  "paths": [
    "httpd",
    "smb"
  ],
  "lines": ""
}
```

Example for file mode:
```json
{
  "action": "dump",
  "mode": "file",
  "paths": [
    "/var/log/maillog",
    "/var/log/messages"
  ],
  "lines": "20"
}
```

Example with filter:
```json
{
  "action": "dump",
  "mode": "log",
  "paths": [
    "/var/log/maillog"
  ],
  "lines": "",
  "filter": "2696210DAFFF"
}
```


#### follow

Required fields:

- `mode`: can be `systemd` or `files`
- `paths`: list of systemd units or absolute file paths

Example for `systemd` mode
```json
{
  "action": "follow",
  "mode": "systemd",
  "paths": [
    "httpd",
    "smb"
  ]
}
```

Example for file mode:
```json
{
  "action": "follow",
  "mode": "file",
  "paths": [
    "/var/log/maillog",
    "/var/log/messages"
  ]
}
```


### Output

#### dump

Example for `systemd` mode:
```
-- Logs begin at Thu 2018-11-22 11:52:39 CET, end at Fri 2018-11-23 10:32:04 CET. --
Nov 22 11:52:59 test.local.neth.eu systemd[1]: Starting The Apache HTTP Server...
Nov 22 11:53:04 test.local.neth.eu systemd[1]: Starting Samba SMB Daemon...
Nov 22 11:53:07 test.local.neth.eu systemd[1]: Started Samba SMB Daemon.
Nov 22 11:53:07 test.local.neth.eu smbd[1160]: [2018/11/22 11:53:07.412928,  0] ../lib/util/become_daemon.c:124(daemon_ready)
Nov 22 11:53:07 test.local.neth.eu smbd[1160]:   STATUS=daemon 'smbd' finished starting up and ready to serve connections
Nov 22 11:53:08 test.local.neth.eu systemd[1]: Started The Apache HTTP Server.
Nov 22 19:03:19 test.local.neth.eu systemd[1]: Reloaded The Apache HTTP Server.
Nov 22 19:12:17 test.local.neth.eu systemd[1]: Reloaded The Apache HTTP Server.
```

Example for `file` mode:
```
==> /var/log/maillog <==
Nov 23 09:47:14 test postfix/local[29323]: D799E3155647: to=<root@test.local.neth.eu>, relay=local, delay=0.61, delays=0.41/0.01/0/0.2, dsn=2.0.0, status=sent (delivered to mailbox)
Nov 23 09:47:14 test postfix/qmgr[1374]: D799E3155647: removed
Nov 23 09:47:14 test postfix/qmgr[1374]: 1796D3155649: from=<no-reply@test.local.neth.eu>, size=443, nrcpt=1 (queue active)
Nov 23 09:47:14 test postfix/pickup[28050]: 62AD03155647: uid=0 from=<no-reply@test.local.neth.eu>
...

==> /var/log/messages <==
Nov 23 09:47:11 test esmith::event[29562]: expanding /etc/firehol/fireqos.conf
Nov 23 09:47:11 test esmith::event[29562]: expanding /var/www/html/wpad.dat
Nov 23 09:47:11 test esmith::event[29562]: Action: /etc/e-smith/events/actions/generic_template_expand SUCCESS [0.443582]
...
```

#### follow

The output is the same for `dump` action but it keeps to follow the stream until the command is interrupted.
