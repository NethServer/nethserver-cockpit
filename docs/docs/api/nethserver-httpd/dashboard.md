## Dashboard

### Input

Available query sections

- `live`: rpm versions of the installed Lamp stack and number of the vhost/proxypass created
- `apacheStatus`: statistics on the apache service

The input query format is:

```json
echo '{"action":"live"}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/dashboard/read | jq

echo '{"action":"apacheStatus"}' | /usr/bin/sudo /usr/libexec/nethserver/api/nethserver-httpd/dashboard/read | jq
```

### Output

The output contains the queried sections. Possible keys are:

- `live`

detection of databases and php rpm (from nethserver integration of software collection)
detection if nethserver-httpd-virtualhosts is installed (0 or 1)

```json
{
  "versions": {
    "database_SCL": {
      "rh-postgresql94": "9.4.14"
    },
    "default": {
      "php": "5.4.16",
      "httpd": "2.4.6",
      "mysqld": "5.5.60-MariaDB"
    },
    "php_SCL": {
      "rh-php72-php-fpm": "7.2.10",
      "rh-php71-php-fpm": "7.1.8"
    }
  },
  "packages": {
    "virtualhost": 1
  },
  "statistics": {
    "ProxyPass": 0,
    "VhostReverse": 2,
    "virtualhosts": 4
  },
  "services": {
    "php": 1,
    "rh-php72-php-fpm": 1,
    "postgresql": 0,
    "rh-php71-php-fpm": 1,
    "rh-postgresql94-postgresql": 1,
    "httpd": 1,
    "mysqld": 1
  }
}
```

- `apacheSatus`

Statistics on the apache service based on Apache mod_status

```json
{
  "BytesPerReq": "1764.43",
  "Total_kbytes": "448",
  "ReqPerSec": ".00464195",
  "Uptime": "56011",
  "statistics": {
    "RunningWorkers": "1",
    "SpareWorkers": 248,
    "IdleWorkers": "7"
  },
  "TotalAccess": "260",
  "BytesPerSec": "8.19039"
}
```