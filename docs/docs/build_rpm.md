# Building RPM

## Automatic builds

The package is automatically built using [Travis](https://travis-ci.org/NethServer/nethserver-cockpit)

Build are started when:

- a new PR has been created
- one or more commit have been pushed to the master branch

**Note:** due to Travis limits, the package should have a new tag every 50 commits.
The tag avoids the upload of a testing package inside the sable repository.

## Locally

Move to the root directory of cloned repository and
use standard ``make-rpms`` NethServer tool:
```
./prep-sources && make-rpms
```

## Upstream RPMs

The upstream project provides packages for EPEL.
To install it from the upstream repository:

```bash
wget https://copr.fedorainfracloud.org/coprs/g/cockpit/cockpit-preview/repo/epel-7/group_cockpit-cockpit-preview-epel-7.repo -O /etc/yum.repos.d/cockpit.repo
yum install nethserver-cockpit*rpm
```

