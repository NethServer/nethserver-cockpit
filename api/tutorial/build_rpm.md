# Building RPM

Move to the root directory of cloned repository and
use standard ``make-rpms`` NethServer tool:
```
  ./prep-sources && make-rpms
```

## Install RPM

1. Copy the rpm to the NethServer

2. Access the NethServer, then download COPR repository:
   ```
   wget https://copr.fedorainfracloud.org/coprs/g/cockpit/cockpit-preview/repo/epel-7/group_cockpit-cockpit-preview-epel-7.repo -O /etc/yum.repos.d/cockpit.repo
   yum install nethserver-cockpit*rpm
   ```

