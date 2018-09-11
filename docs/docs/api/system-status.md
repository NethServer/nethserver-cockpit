# system-status

Return variuous information on the server.

The system status is composed by:

- CPU number and type
- kernel version
- memory statistics (in kB)
- uptime
- os release
- load
- hardware vendor and product name


## read

### Output

Example:
```json
{
    "configuration": "",
    "status": {
        "cpu": {
            "model": "Intel(R) Core(TM) i5-3570 CPU @ 3.40GHz",
            "n": 1
        },
        "hardware": "innotek GmbH VirtualBox",
        "kernel": "3.10.0-693.21.1.el7.x86_64",
        "load": [
            0.18,
            0.06,
            0.06
        ],
        "memory": {
            "Active": 364,
            "Active(anon)": 55,
            "Active(file)": 310,
            "AnonHugePages": 14,
            "AnonPages": 109,
            "Bounce": 0,
            "Buffers": 3,
            "Cached": 471,
            "CommitLimit": 1521,
            "Committed_AS": 574,
            "DirectMap2M": 938,
            "DirectMap4k": 86,
            "Dirty": 1,
            "HardwareCorrupted": 0,
            "HugePages_Free": 0,
            "HugePages_Rsvd": 0,
            "HugePages_Surp": 0,
            "HugePages_Total": 0,
            "Hugepagesize": 2,
            "Inactive": 218,
            "Inactive(anon)": 72,
            "Inactive(file)": 146,
            "KernelStack": 3,
            "Mapped": 39,
            "MemAvailable": 591,
            "MemFree": 170,
            "MemTotal": 993,
            "Mlocked": 0,
            "NFS_Unstable": 0,
            "PageTables": 18,
            "SReclaimable": 145,
            "SUnreclaim": 31,
            "Shmem": 18,
            "Slab": 176,
            "SwapCached": 1,
            "SwapFree": 1013,
            "SwapTotal": 1024,
            "Unevictable": 0,
            "VmallocChunk": 33554424,
            "VmallocTotal": 33554432,
            "VmallocUsed": 6,
            "Writeback": 0,
            "WritebackTmp": 0
        },
        "release": "NethServer release 7.5.1804 (final)",
        "uptime": {
            "days": 0,
            "hours": 1,
            "minutes": 34,
            "seconds": 42
        }
    }
}
```
