# dashboard

NethServer firewall basic statistics.

## read

No input is required.

### Output

Return basic statistics for the dashaboard.

The `hosts` field contains the number of ARP entries.

Output example:
```json
{
  "connections": {
    "udp": 1,
    "tcp": 3,
    "total": 5,
    "icmp": 1
  },
  "providers": {
    "red1": {
      "status": 0,
      "weight": "1",
      "nslabel": "myprovider"
      "interface": "ens7"
    }
  },
  "services": {},
  "statistics": {
    "hosts": 8,
    "tc": 3,
    "portforward": 2,
    "routes": 0,
    "objects": {
      "fwtimes": 1,
      "iprange": 1,
      "hosts": 11,
      "cidr": 2,
      "fwservices": 49,
      "zones": 1,
      "host-group": 1
    },
    "fwrules": 20,
    "vpn": 0
  }
}
```

