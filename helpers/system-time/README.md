# read

Return the current date and time along with chronyd configuration.
If chronyd status is disabled, the time configuration is manual.

Output example:
```
{
  "status": {
    "time": "Wed Sep  5 15:28:59 GMT 2018"
  },
  "configuration": {
    "chronyd": {
      "props": {
        "UDPPort": "123",
        "NTPServer": "pool.ntp.org",
        "status": "enabled",
        "access": "green"
      },
      "name": "chronyd",
      "type": "service"
    },
    "timezone": "Africa/Monrovia",
    "timezones": [
      "Africa/Abidjan",
      "Africa/Accra",
      ...
      "UTC"
    ]
  }
}
```

# validate

Input:
- `chronyd` and `timezone` field from read input
- if `chronyd` status is disabled, the keys named `date` and `time` must contain the 
  a valid time (HH:MM) and date (YYYY-MM-DD).

Example:
```
{
  "chronyd": {
    "props": {
      "UDPPort": "123",
      "NTPServer": "pool.ntp.org",
      "status": "enabled",
      "access": "green"
    },
    "name": "chronyd",
    "type": "service"
  },
  "timezone": "Africa/Monrovia",
  "time": "10:33",
  "date": "2018-09-06"
}
```

Command example:
```
 echo '{"chronyd":{"props":{"UDPPort":"123","NTPServer":"pool.ntp.org","status":"enabled","access":"green"},"name":"chronyd","type":"service"},"timezone":"Africa/Monrovia","time":"10:33","date":"2018-09-06"}' | ./validate 
```

# update

Set current timezone and chronyd configuration.
If chronyd is disabled, date and time is set to manual input values.
Tries also to set PHP timezone (fails silently). 

Input: same input as validate
