Name:           nethserver-cockpit
Version: 1.10.10
Release: 1%{?dist}
Summary:        NethServer Server Manager Web UI

License:        GPLv3
URL:            %{url_prefix}/%{name}
Source0:        %{name}-%{version}.tar.gz
# Execute ./prep-sources to create Source1
Source1:        nethserver-cockpit-ui.tar.gz
BuildArch:      noarch

BuildRequires:  nethserver-devtools
Requires:       %{name}-lib >= %{version}-%{release}
Requires:       cockpit, cockpit-storaged
Requires:       jq, openldap-clients, expect, python-pwquality
Requires:       nethserver-subscription
Requires:       arp-scan
Requires:       nethserver-lang-cockpit 
Requires:       pam_oath liboath perl-Convert-Base32 oathtool
Requires:       swaks
Obsoletes:      cockpit-packagekit, PackageKit, PackageKit-yum

%description
NethServer Server Manager Web UI based on Cockpit

%package lib
Summary: API libraries for NethServer Server Manager Web UI
BuildRequires:  nethserver-devtools
%description lib
Provides code libraries to build the Cockpit-based Server Manager API helpers

%prep
%setup -q

%build
%{makedocs}
mkdir -p root%{perl_vendorlib}
cp -av lib/perl/NethServer root%{perl_vendorlib}
gzip -v root/usr/share/cockpit/nethserver/libs/*.js
perl createlinks

%install
(cd root ; find . -depth -not -name '*.orig' -print | cpio -dump %{buildroot})
mkdir -p %{buildroot}/usr/share/cockpit/nethserver/
tar xvf %{SOURCE1} -C %{buildroot}/usr/share/cockpit/nethserver/
gzip -v %{buildroot}/usr/share/cockpit/nethserver/js/*
gzip -v %{buildroot}/usr/share/cockpit/nethserver/css/*
mkdir -p %{buildroot}/usr/libexec/nethserver/
mv api/ %{buildroot}/usr/libexec/nethserver/
mkdir -p %{buildroot}/%{_localstatedir}/lib/nethserver/2fa
%{genfilelist}  %{buildroot} | \
    grep -v \
    -e '^/usr/libexec/nethserver/api/lib' \
    -e '^%{perl_vendorlib}' \
    -e '^/usr/share/cockpit/nethserver/categories/categories.json' \
    -e '^/etc/sudoers.d/50_nsapi' \
    > file.lst

%files -f file.lst
%license COPYING
%doc README.rst
%config /usr/share/cockpit/nethserver/categories/categories.json
%attr(0440,root,root) /etc/sudoers.d/50_nsapi
%attr(0440,root,root) %ghost /etc/sudoers.d/55_nsapi_perms
%dir %{_nseventsdir}/%{name}-update
%dir /usr/libexec/nethserver/api/

%files lib
%license COPYING
/usr/libexec/nethserver/api/lib/
%{perl_vendorlib}/NethServer

%changelog
* Thu Apr 28 2022 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.10-1
- SFTP backup deleted when target is unreachable - Bug NethServer/dev#6658

* Mon Mar 14 2022 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.9-1
- Cockpit: application removal could be broken - Bug NethServer/dev#6645
- Log manager agent - nethesis/dev#6108

* Fri Jan 14 2022 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.8-1
- User password: validate and honor the weak password strength - Bug NethServer/dev#6621

* Thu Nov 18 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.7-1
- Cannot use short username in SMTP smarthost settings - Bug NethServer/dev#6594

* Tue Oct 26 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.6-1
- Cockpit backup: support path-style S3 buckets - NethServer/dev#6586

* Mon Oct 25 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.5-1
- Change network role from DHCP to PPPoE doesn't stop dhclient - Bug NethServer/dev#6587

* Mon Oct 18 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.4-1
- Cockpit Network: Delete or release role should not be possible when aliases or routes exist - Bug NethServer/dev#6580

* Mon Jul 05 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.3-1
- Cockpit: httpd application must not be removable - Bug NethServer/dev#6540

* Mon Jun 28 2021 Stephane de Labrusse <stephdl@de-labrusse.fr> - 1.10.2-1
- Account provider Bind DN validation error - Bug NethServer/dev#6534

* Mon Jun 07 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.1-1
- Smarthost validation: curl must not verify certificates - Bug NethServer/dev#6516
- Update info box translation for range and port list - NethServer/nethserver-cockpit#338

* Mon May 17 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.10.0-1
- Cockpit: custom documentation URL - NethServer/dev#6511

* Tue May 11 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.9.5-1
- WAN: notification of wan down not sent - Bug NethServer/dev#6497

* Mon Apr 26 2021 Davide Principi <davide.principi@nethesis.it> - 1.9.4-1
- Relax sender-based relay host rules validator - NethServer/dev#6495

* Mon Apr 19 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.9.3-1
- Cockpit settings: unable to show root password - Bug NethServer/dev#6483

* Wed Apr 14 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.9.2-1
- LocalRules: The access property is removed when allowed to localhost - Bug NethServer/dev#6482

* Tue Mar 09 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.9.1-1
- With failed test mail it is not possible to disable the smart host - Bug NethServer/dev#6450

* Fri Mar 05 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.9.0-1
- Cockpit: Validate smarthost settings - NethServer/dev#6445
- Cockpit: show total of users and groups - NethServer/dev#6443

* Tue Mar 02 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.8.24-1
- restic backup prune every day - Bug NethServer/dev#6438

* Tue Feb 16 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.23-1
- Firewall WAN: wrong gateway IP - Bug NethServer/dev#6425

* Thu Feb 04 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.22-1
- Cockpit UI. Move Let's Encrypt certificate action to primary.  - NethServer/dev#6417
- Let's Encrypt renewal does not fire certificate-update event - Bug NethServer/dev#6403

* Tue Jan 12 2021 Davide Principi <davide.principi@nethesis.it> - 1.7.21-1
- Password age changes are not applied - Bug NethServer/dev#6387

* Mon Jan 11 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.20-1
- UI issue on tables using vue-good-table - Bug NethServer/dev#6390

* Fri Jan 08 2021 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.19-1
- Firewall: application name change breaks delegation - Bug NethServer/dev#6388

* Wed Dec 23 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.18-1
- Applications page: empty kebab menu for external applications - Bug NethServer/dev#6374

* Wed Dec 16 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.16-1
- Cockpit validator of memberOf uses space in the message - Bug NethServer/dev#6365
- Google Chrome 87 prevents access to WebTop - Bug NethServer/dev#6364

* Wed Dec 16 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.15-1
- Cockpit: delete a certificate from the UI - NethServer/dev#6362

* Thu Dec 10 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.14-1
- LetsEncrypt: Create a certificate with all known FQDN - NethServer/dev#6353

* Wed Dec 02 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.13-1
- Display the restic backup secret - NethServer/dev#6346
- Business Cube: improve Cockpit interface - Bug NethServer/dev#6349

* Wed Nov 18 2020 Davide Principi <davide.principi@nethesis.it> - 1.7.12-1
- New NethServer 7.9.2009 defaults - NethServer/dev#6320
- Fix undefined references (NethServer/nethserver-cockpit#298)

* Tue Nov 17 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.11-1
- Bogus Shell Override in account provider bind procedure - Bug NethServer/dev#6327

* Fri Oct 30 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.10-1
- Cockpit: can't edit system services with delegates user - Bug NethServer/dev#6316

* Wed Oct 07 2020 Davide Principi <davide.principi@nethesis.it> - 1.7.9-1
- Upgrade NS6 to Active Directory Cockpit procedure - NethServer/dev#6290

* Tue Sep 29 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.8-1
- Cockpit: network alias creation failed - Bug NethServer/dev#6288

* Wed Jul 22 2020 Edoardo Spadoni <edoardo.spadoni@nethesis.it> - 1.7.7-1
- Network: no feedback if invalid interface label is entered - Bug NethServer/dev#6237

* Fri Jul 17 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.6-1
- Cockpit: enhance rebranding - nethesis/dev#5843

* Tue Jul 07 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.5-1
- OpenSSH: Use strong encryption - NethServer/dev#6218

* Thu Jul 02 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.4-1
- Human readable numbers in Cockpit dashboards - NethServer/dev#6206
- An unnecessary login window is shown in chromium at cockpit login page - Bug NethServer/dev#6215
- Software Center: page reloads if enter key is pressed while searching - NethServer/dev#6209

* Fri Jun 12 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.3-1
- Cockpit: user other than root cannot change Smart host settings - NethServer/dev#6198
- Add ntopng 4 - NethServer/dev#6199

* Thu Jun 04 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.2-1
- Cockpit & Firewall: Hotspot interface shown as not recognized - Bug NethServer/dev#6186
- Cockpit: backup page display an empty list - Bug NethServer/dev#6184
- Remove TLS 1.0 and TLS 1.1 - NethServer/dev#6170

* Tue May 26 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.1-1
- Cockpit: Backup view all logs - Nethserver/dev#6175

* Fri May 22 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.7.0-1
- Cockpit: update vue-good-table to v2.19.3 - NethServer/dev#6174
- Create smart host relay to send email with another smtp - NethServer/dev#6169

* Tue May 19 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.9-1
- Cockpit: backup destination disk space bar is not working - Bug NethServer/dev#6168

* Fri May 15 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.8-1
- Cockpit: can't validate AD credentials - Bug NethServer/dev#6166
- User settings page link in Nethesis launcher - nethesis/dev#5802
- Shortcut and Pin are not removed when the application is uninstalled - Bug NethServer/dev#6162

* Tue May 12 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.7-1
- Cockpit: admin cannot uninstall applications - NethServer/dev#6153

* Wed May 06 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.6-1
- Cockpit UI: Backup format warning - Nethserver/dev#6151

* Tue May 05 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.5-1
- ui. remove useless change hostname message (#255)
- api: relax S3Host validator (#253)

* Tue Apr 28 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.4-1
- OpenVPN: New policy certificate-otp for RW - NethServer/dev#6112

* Fri Apr 10 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.3-1
- Cockpit: generic error on password change - NethServer/dev#6125

* Thu Apr 09 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.2-1
- Cockpit: prefill interface fields when creating bridge or bond verified - NethServer/dev#6122

* Wed Apr 08 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.1-1
- 2FA not completely restored after disaster recovery - Bug NethServer/dev#6109

* Tue Apr 07 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.6.0-1
- Backup-data Duplicity - 'volsize' parameter is set to 2Mb - Bug Nethserver/dev#6110
- Cockpit: user settings in a separate page - Nethserver/dev#6100
- Restore configuration without network override - NethServer/dev#6099

* Wed Mar 25 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.5.1-1
- Openssh: Protect password login with 2FA - NethServer/dev#6088

* Tue Mar 24 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.5.0-1
- Cockpit: protect the server-manager with one time password (2FA) - NethServer/dev#6085
- Blacklist support (threat shield) - NethServer/dev#6072

* Mon Mar 02 2020 Davide Principi <davide.principi@nethesis.it> - 1.4.6-1
- SSH Save button stuck after update - Bug NethServer/dev#6075

* Thu Feb 27 2020 Davide Principi <davide.principi@nethesis.it> - 1.4.5-1
- Allow everyone to use SFTP and restrict SSH port forwarding - NethServer/dev#6059
- Failed to unset TFTP in DHCP advanced options - Bug NethServer/dev#6068

* Mon Feb 24 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.4.4-1
- Failed to unset TFTP in DHCP advanced options - Bug NethServer/dev#6068

* Tue Feb 18 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.4.3-1
- Cockpit & Firewall: allow port ranges in system services - Bug NethServer/dev#6063
- Cockpit: interface ip validation fails if there are ip aliases configured on the interface - Bug NethServer/dev#6061

* Tue Feb 11 2020 Davide Principi <davide.principi@nethesis.it> - 1.4.2-1
- Missing delegation UI with remote account provider - Bug NethServer/dev#6023

* Thu Feb 06 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.4.1-1
- No input sanitization in nethserver-cockpit/api/lib/users_functions.php  - Bug NethServer/dev#6042

* Wed Jan 29 2020 Davide Principi <davide.principi@nethesis.it> - 1.4.0-1
- Group-based access restriction for Cockpit and SSH  - Nethserver/dev#6029
- Delegation of logs page doesn't have any effect - Bug NethServer/dev#6033
- Group-based access restriction for Cockpit and SSH  - NethServer/dev#6029
- Selected bond mode ignored in Cockpit - Bug Nethserver/dev#6032

* Wed Jan 22 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.17-1
- Selected bond mode ignored in Cockpit - Bug Nethserver/dev#6032

* Fri Jan 17 2020 Davide Principi <davide.principi@nethesis.it> - 1.3.16-1
- Cockpit: not able to change backup-config HistoryLength - Bug NethServer/dev#6031

* Wed Jan 15 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.15-1
- Cockpit: DHCP not loaded if there is an only-number host - Bug NethServer/dev#6021
- Cockpit Dashboard empty hardware/info - Bug NethServer/arm-dev#34

* Wed Jan 08 2020 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.14-1
- Cockpit: custom network services - NethServer/dev#6006

* Fri Dec 20 2019 Davide Principi <davide.principi@nethesis.it> - 1.3.13-1
- Cockpit disconnection breaks yum transactions - Bug NethServer/dev#6002

* Thu Dec 19 2019 Davide Principi <davide.principi@nethesis.it> - 1.3.12-1
- Cockpit: improve main dashboard view - NethServer/dev#5990

* Fri Dec 13 2019 Davide Principi <davide.principi@nethesis.it> - 1.3.11-1
- Bad user password change validation in Cockpit - Bug NethServer/dev#5984

* Wed Dec 11 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.10-1
- Delegation regression in Cockpit pinned apps - Bug NethServer/dev#5976
- SOGo: URL of webmail in the application cockpit list - NethServer/dev#5982
- More intuitive behaviour in case of conflit among access rules to cockpit interface(only with firewall installed) - Bug NethServer/dev#5983
- Certificate update event cut off by Cockpit UI - Bug NethServer/dev#5977
- Backup: missing engine choice for WebDAV storage engine - Bug NethServer/dev#5981

* Wed Dec 04 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.9-1
- Cockpit: sort users and groups - NethServer/dev#5969

* Tue Dec 03 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.8-1
- IP and netmask validation in Network page - NethServer/dev#5974

* Tue Dec 03 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.7-1
- Cockpit: show DHCP lease expiration date - NethServer/dev#5972

* Mon Dec 02 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.6-1
- Cockpit: open group created in NethGUI generates error - Bug NethServer/dev#5970

* Mon Dec 02 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.5-1
- Cockpit: improve modal view - NethServer/dev#5965

* Thu Nov 28 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.4-1
- Cockpit: improve Software Center view - NethServer/dev#5959

* Wed Nov 27 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.3-1
- Cockpit: page title is not updated on page change - Bug Nethserver/dev#5946
- Cockpit: overlay remains active after page change - Bug NethServer/dev#5961

* Tue Nov 26 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.2-1
- Improve configuration restore - NethServer/dev#5907
- Cockpit: Software Center updates duplicates - Bug NethServer/dev#5950

* Thu Nov 21 2019 Davide Principi <davide.principi@nethesis.it> - 1.3.1-1
- Network recovery console tool - NethServer/dev#5874

* Thu Nov 21 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.3.0-1
- Improve configuration restore - Nethserver/dev#5907
- Cockpit: validate host deletion - Bug NethServer/dev#5909
- Cannot upload config backup file as first element - Bug Nethserver/dev#5906
- Cockpit: validate host deletion - Bug Nethserver/dev#5909
- Password change: handle backslash - Bug NethServer/dev#5927
- Improve configuration restore - NethServer/dev#5907
- Multiple UI cosmetic fixes

* Tue Nov 12 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.2.2-1
- Cockpit: vlan parameters without a role are not displayed - Bug Nethserver/dev#5895
- Cockpit: network label can't contain spaces - Bug NethServer/dev#5893

* Thu Oct 31 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.2.1-1
- Cockpit backup: remove record from db if failed - Bug NethServer/dev#5882

* Mon Oct 28 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.2.0-1
- Cockpit: add missing validation labels - Bug Nethserver/dev#5884
- Cockpit: add missing validation labels - Bug NethServer/dev#5884
- backup-data: view last log grayed out - Bug Nethserver/dev#5877
- Cockpit: invalid IP address allowed for DC - Bug NethServer/dev#5871
- Cockpit: cannot edit the self-signed certificate - Bug NethServer/dev#5872
- Cockpit dashboard: wrong path loaded in applications - Bug Nethserver/dev#5869
- Cockpit: invalid IP address allowed for DC - Bug Nethserver/dev#5871

* Fri Oct 11 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.1.2-1
- Cockpit: can't configure upstream proxy without user and password - Bug NethServer/dev#5863

* Thu Oct 10 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.1.1-1
- ui. fix doc info errors in console
- improve DHCP scan behavior - NethServer/nethserver-cockpit#145

* Thu Oct 10 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.1.0-1
- Cockpit: prevent usage of localhost.localdomain hostname - NethServer/dev#5861
- Improve app launcher loading - NethServer/dev#5859
- Cockpit: improve English labels - NethServer/dev#5856

* Mon Oct 07 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.0.3-1
- Cockpit downloads fail on Firefox - Bug Nethserver/dev#5855

* Thu Oct 03 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.0.2-1
- Cockpit: yum is locked by packagekit - Bug NethServer/dev#5854
- Cockpit: restore of backup-config failed - Bug NethServer/dev#5853

* Tue Oct 01 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.0.1-1
- settings: allow changes for delegated users and root (#140)

* Tue Oct 01 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 1.0.0-1
- Cockpit: make network diagnostic tools - NethServer/dev#5839
- Sudoers based authorizations for Cockpit UI - Nethserver/dev#5805
- Cockpit: Display the hostname during a network scan - NethServer/dev#5844
- Sudoers based authorizations for Cockpit UI - NethServer/dev#5805

* Fri Sep 20 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.15.1-1
- Cockpit: make network diagnostic tools - NethServer/dev#5839

* Mon Sep 16 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.14-1
- Cockpit: scan the network to make IP reservation - NethServer/dev#5830

* Wed Sep 04 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.13.1-1
- Do not raise bind credentials warning for local account providers - Regression from NethServer/dev#5825

* Tue Sep 03 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.13.0-1
- Cockpit: AD custom bind credentials - NethServer/dev#5825
- Cockpit: show green subnet range while creating AD provider - NethServer/dev#5822
- Cockpit: AD DNS server validation - NethServer/dev#5817
- Various UI improvements

* Mon Aug 26 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.12.0-1
- Cockpit. fix various bugs - Bug Nethserver/dev#5810
- Multiple UI improvements
- Cockpit: link apps in home page - NethServer/dev#5806

* Thu Aug 01 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.11.0-1
- Disk usage configuration: don't cross filesystem boundaries - NethServer/dev#5795
- ui. fixed overflow in button

* Tue Jul 23 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.10.0-1
- Refactor cockpit firewall access (#108)
- Support enable/disable backup data
- Removed support for legacy applications
- Improved translations
- Better validation on Active Directory and DHCP
- Fix backup-config forced execution

* Tue Jul 02 2019 Davide Principi <davide.principi@nethesis.it> - 0.9.3-1
- Migrate YUM repositories hosting to Porthos - nethesis/dev#5641
- ui. Fix invalid function call checkSystemTasks()
- Add TLS policy missing translations (#105)
 

* Wed Jun 19 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.9.2-1
- api. sort interfaces for network page
- ui & api. display nslabel on dhcp page

* Mon Jun 17 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.9.1-1
- ui. support NFS for rsync backup engine (nethserver-cockpit#103)

* Fri Jun 14 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.9.0-1
- ui. improve network page visualization
- ui. fix for pppoe network visualization
- network api: improve provider management
- ui. added delete button for missing interfaces

* Wed Jun 12 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.8.0-1
- ui. added overflow visible for dropups
- ui. handle missing icon on application list

* Tue May 28 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.7.0-1
- File server Cockpit UI - NethServer/dev#5754
- IPS Cockpit UI - NethServer/dev#5756
- Web proxy Cockpit UI - NethServer/dev#5746
- Various UI improvements
- Add perl library for API

* Wed May 08 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.6.0-1
- Mail Cockpit UI - NethServer/dev#5744
- Mail server: sender dependent relay - NethServer/dev#5743
- Backup retention: 1 day - NethServer/dev#5748
- Variuos fixes on backup, network, dhcp, applications and logs pages
- Backup: support partitioning of disks greater than 3 TB

* Wed Mar 27 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.5.0-1
- Backup: hide/show password field
- Network: allow creation of logic interface on existing ones
- Backup: date is now in UTC
- Improve password meter component
- Improve labels and common components
- Refactor i18n

* Mon Mar 25 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.4.2-1
- Security fix - NethServer/dev#5738
- Network: allow creation of logical interfaces over existing interfaces
- DHCP: support array of IP addresses
- Compress JS and CSS files
- Improve language selection
- Restore Terminal and Subscription menu items
- Minor UI and API fixes

* Wed Mar 06 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.4.1-1
- network api: create provider only if not exists

* Tue Mar 05 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.4.0-1
- Advanced options is visible on password change form - Bug NethServer/dev#5715
- Ejabberd Cockpit UI - NethServer/dev#5719
- Add delegation fro groups
- Fix provider creation on network page
- Many API and UI fixes

* Wed Jan 30 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.3.0-1
- Remove single backup data - NethServer/dev#5691
- Users can now change their password on local or remote account provider - NethServer/nethserver-cockpit#38
- DHCP improvements
- Edit Let's Encrypt certificate

* Thu Jan 10 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.2.2-1
- Subscription: implement unsubscribe - NethServer/dev#5688

* Tue Jan 08 2019 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.2.1-1
- CIFS Backup fails after upgrade to 7.6 - NethServer/dev#5687
- DNS hint: use all name servers (thanks mikeBOLD)
- Adjust correct name for legacy in application menu (thanks StephDL)

* Fri Dec 21 2018 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.2.0-1
- Cockpit: support Community and Enterprise registration - NethServer/dev#5676

* Wed Dec 12 2018 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.1.1-1
- Fix Software Center behavior if no updates are available

* Tue Dec 11 2018 Giacomo Sanchietti <giacomo.sanchietti@nethesis.it> - 0.1.0-1
- Cockpit Alpha 1 - NethServer/dev#5660

* Fri Sep 15 2017 Davide Principi <davide.principi@nethesis.it> - 0.0.0-1.ns7
- Initial version
