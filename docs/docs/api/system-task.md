# system-task

Check if there is a running event.

## read

### Output

If no running tasks is found, just output:
```json
{
  "steps": -1,
  "event": null,
  "message": "no running tasks"
}
```

Otherwise output the following once per second, until the
event has been terminated:
```json
{
  "steps": -1,
  "pid": 15018,
  "args": "arg1 arg2",
  "event": "nethserver-event-name"
}
```

If `steps` has value equal to `-1`, the system can't determinate
the progess of the running event.
