Name:           nethserver-cockpit
Version: 1.1.1
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
