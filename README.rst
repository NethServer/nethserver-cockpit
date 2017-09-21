==================
nethserver-cockpit
==================

NethServer Cockpit UI and new Server Manager.

The document describe how to prepare an environemnt to develop

Prepare the environment
=======================

- Install developer tools: npm and git

  On Fedora: ::

    dnf install npm git

  On CentOS: ::

    yum install npm git

- Clone the repository: ::

    git clone git@github.com:NethServer/nethserver-cockpit

- Install grunt globally: ::

    npm install -g grunt-cli bower generator-angular yo


  You can ignore warnings like this: ::

    WARN generator-angular@0.16.0 requires a peer of generator-karma@>=0.9.0 but none was installed.


- Enter inside the cloned repository and install all dependencies: ::

    cd nethserver-cockpit/

    cd api/system/ && npm install
    cd ..
    cd ui/ && npm install && bower install

Build API and UI
================

Enter API directory and build using grunt: ::

  cd api/system/ && grunt build


Enter UI directory and build using grunt: ::

  cd ui/ && grunt build

You can ignore ignore warnings like this: ::

  npm WARN api@1.0.0 No repository field.
  npm WARN api@1.0.0 No license field.


Build RPM
=========

Move to the root directory of clone repository and
use standard ``make-rpms`` NethServer tool: ::

  make-rpms

Install
=======

Install all built files inside the NetServer machine.
Let's assume the machine has IP ``192.168.1.20``.

RPM
---

Access the NethServer, then download COPR repository: ::

  wget https://copr.fedorainfracloud.org/coprs/g/cockpit/cockpit-preview/repo/epel-7/group_cockpit-cockpit-preview-epel-7.repo -O /etc/yum.repos.d/cockpit.repo

Copy ``nethserver-cockpit`` rpm to the machine and install it: ::


  scp nethserver-cockpit-*.noarch.rpm root@192.168.1.20:
  ssh root@192.168.1.20 "yum install nethserver-cockpit*noarch.rpm"

API and UI
----------

Files can be copied using rsync.
Use the following commands: ::
  
  ssh root@192.168.1.20  "mkdir -p ~/.local/share/cockpit/nethserver"

  cd api/ && grunt rsync:root@192.168.1.20:22:~/.local/share/cockpit/nethserver
  cd ui/system && grunt rsync:root@192.168.1.20:22:~/.local/share/cockpit/nethserver

