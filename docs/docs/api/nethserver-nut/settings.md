# settings

Manage NUT settings.

## read

The read API requires an `app_info` field.
Valid `app_info` are:

- `configuration`
- `models`

### Input

#### configuration

Example:
```json
{
  "app_info": "configuration"
}
```

#### models

Example:
```json
{
  "app_info": "models"
}
```

### Output

#### configuration

Return the current configuration of `nut-server` and `nut-monitor` services.

Output example:
```json
{
  "configuration": {
    "nut_monitor": {
      "type": "service",
      "name": "nut-monitor",
      "props": {
        "status": "enabled",
        "Master": "nethservice.nethesis.it",
        "Notify": "disabled"
      }
    },
    "nut_server": {
      "type": "service",
      "name": "nut-server",
      "props": {
        "status": "disabled",
        "access": "green",
        "User": "upsmon",
        "TCPPort": "3493",
        "Device": "auto",
        "Model": "",
        "Password": "$4fep$ssword",
        "Ups": "UPS"
      }
    }
  }
}
```

#### models

Retrive information about all supported UPS models and their drivers.

Output example:
```json
{
  "models": [
    {
      "drivers": [
        "mge-utalk",
        "mge-shut"
      ],
      "description": "Eaton - various models (serial mode) (*****)",
      "support_level": "5",
      "model_name": "various models (serial mode)",
      "manufacturer": "Eaton"
    },
    {
      "drivers": [
        "usbhid-ups"
      ],
      "description": "Tripp Lite - INTERNET550U (***)",
      "support_level": "3",
      "model_name": "INTERNET550U",
      "manufacturer": "Tripp Lite"
    },
    {
      "drivers": [
        "mge-utalk",
        "oldmge-shut",
        "mge-shut",
        "usbhid-ups"
      ],
      "description": "MGE UPS SYSTEMS - Pulsar Evolution (*****)",
      "support_level": "5",
      "model_name": "Pulsar Evolution",
      "manufacturer": "MGE UPS SYSTEMS"
    }
```

## validate

### Constraints

If setting the node as server/master:

- `status`: must be `enabled` or `disabled`
- `Model`: must be one of the supported drivers declared in `/usr/share/nut/driver.list`
- `Device`: must be one of: `auto`, `/dev/ttyS0`, `/dev/ttyS1`, `/dev/ttyS2`, `/dev/ttyUSB0`, `/dev/ttyUSB1`

If setting the node as client/slave:

- `status`: must be `enabled` or `disabled`
- `Ups`: must not be empty
- `User`: must be a valid username
- `Password`: must not be empty
- `Master`: must be a valid hostname or IP address

### Input

The complete configuration for `nut-server` and `nut-monitor` services.

Example:
```json
{
   "configuration":{
      "nut_server":{
         "props":{
            "status":"disabled",
            "access":"green",
            "User":"upsmon",
            "TCPPort":"3493",
            "Device":"auto",
            "Model":"",
            "Password":"$4fep$ssword",
            "Ups":"UPS"
         }
      },
      "nut_monitor":{
         "props":{
            "status":"enabled",
            "Master":"nethservice.nethesis.it",
            "Notify":"disabled"
         }
      }
   }
}
```

## update

Same input as validate.
