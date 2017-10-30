==================
nethserver-cockpit
==================

This module implement new Server Manager UI using `Cockpit project <http://cockpit-project.org/guide/latest/>`_.

API and NethServer Cockpit developer guide: https://nethserver.github.io/nethserver-cockpit/

Internationalization
====================
Go inside each project folders:

- api
- ui/apps
- ui/system

Execute

`grunt lang-extract`

On root project folder execute

`tx push -s`

Reference: `NethServer i18n <http://docs.nethserver.org/projects/nethserver-devel/en/latest/i18n.html>`_


