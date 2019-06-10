# dashboard

NethServer NUT basic statistics.

## read

The read API requires an `app_info` field.
Valid actions are:

- `configuration`
- `status`

Input example:
```json
{
  "app_info": "configuration"
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

#### status

Return UPS status and connected clients. This information is retrieved by executing `upsc` command

Output example:
```json
{
  "status": {
    "ups_delay_shutdown": "090",
    "ups_temperature": "026.5",
    "input_sensitivity": "M",
    "driver_version": "2.7.2",
    "ups_delay_start": "000",
    "ups_mfr": "APC",
    "device_type": "ups",
    "input_voltage_minimum": "234.7",
    "input_voltage_maximum": "236.1",
    "input_transfer_high": "253",
    "battery_date": "08/28/06",
    "battery_charge_restart": "00",
    "battery_voltage_nominal": "048",
    "battery_voltage": "55.08",
    "driver_parameter_pollinterval": "10",
    "ups_test_interval": "1209600",
    "driver_parameter_port": "/dev/ttyUSB0",
    "ups_id": "UPS_IDEN",
    "ups_status": "OL",
    "device_mfr": "APC",
    "output_voltage": "236.1",
    "battery_charge": "100.0",
    "input_voltage": "236.1",
    "battery_alarm_threshold": "N",
    "ups_model": "Smart-UPS 2200",
    "driver_version_internal": "3.1",
    "ups_test_result": "NO",
    "ups_load": "029.2",
    "ups_serial": "JS0636001865",
    "input_frequency": "50.00",
    "battery_runtime_low": "300",
    "output_voltage_nominal": "230",
    "input_transfer_reason": "simulated power failure or UPS test",
    "battery_runtime": "2820",
    "ups_firmware": "654.13.I",
    "battery_packs": "000",
    "device_model": "Smart-UPS 2200",
    "ups_mfr_date": "08/28/06",
    "input_transfer_low": "208",
    "driver_name": "apcsmart",
    "input_quality": "FF",
    "device_serial": "JS0636001865"
  },
  "clients": [
    "192.168.5.85",
    "localhost.vm.nethesis.it",
    "192.168.5.42",
    "192.168.5.41",
    "192.168.5.48"
  ],
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
        "Model": "genericups upstype=2",
        "Password": "$4fep$ssword",
        "Ups": "ups"
      }
    }
  }
}
```
