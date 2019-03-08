# queue

Manage Postfix queue.

## read

The read API requires and `action` field.
Valid actions are:

- `stats`
- `list`

### Input

#### stats

Return statistics about queue mail messages and queue size.
Accept an extra `time` parameters in seconds.

Example:
```json
{
  "action": "stats",
  "time": 900
}
```

#### list

Example:
```json
{
  "action": "list"
}
```

### Output

#### stats

Queue timeseries.

```json
{
  "mails": {
    "data": [
      [
        1553883500,
        12
      ],
      [
        1553883490,
        11
      ],
      ...
    ],
    "labels": [
      "time",
      "mails"
    ]
  },
  "size": {
    "data": [
      [
        1553883500,
        851
      ],
      [
        1553883490,
        851
      ],
      ...
    ],
    "labels": [
      "time",
      "size"
    ]
  }
}

```

#### list

Display the content of Postfix queue.

Example:
```json
{
  "C79C310DB011": {
    "status": "deferred",
    "sender": "MAILER-DAEMON",
    "rawdate": "Tue Mar 26 09:28:07",
    "reason": "delivery temporarily suspended: connect to local.net[69.172.201.153]:25: Connection refused",
    "recipient": "test@local.net",
    "size": "2996"
  },
  "6791E10FC63B": {
    "status": "deferred",
    "sender": "MAILER-DAEMON",
    "rawdate": "Tue Mar 26 20:28:09",
    "reason": "delivery temporarily suspended: connect to local.net[69.172.201.153]:25: Connection refused",
    "recipient": "test@local.net",
    "size": "2997"
  },
...
}
```

## update

Available actions:

- `send`: try to send a specific message
- `send-all`: try to send all mail in queue

Input example for `send`:
```json
{
  "action": "send",
  "name": "C79C310DB011"
}
```

Input example for `send-all`:
```json
{
  "action": "send-all"
}
```

All calls return a standard error or success message.

## delete

Available actions:

- `delete`: delete a specific message
- `delete-all`: delete all message in queue

Input example for `delete`:
```json
{
  "action": "delete",
  "name": "C79C310DB011"
}
```

Input example for `delete-all`:
```json
{
  "action": "delete-all"
}
```

All calls return a standard error or success message.

