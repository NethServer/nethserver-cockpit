Name:           nethserver-cockpit
Version: 0.3.0
Release: 1%{?dist}
Summary:        NethServer Server Manager Web UI

License:        GPLv3
URL:            %{url_prefix}/%{name}
Source0:        %{name}-%{version}.tar.gz
# Execute prep-sources to create Source1
Source1:        nethserver-cockpit-ui.tar.gz
BuildArch:      noarch

BuildRequires:  nethserver-devtools
Requires:       cockpit, cockpit-storaged, cockpit-packagekit
Requires:	jq, openldap-clients, expect, python-pwquality
Requires:       nethserver-subscription

%description
NethServer Server Manager Web UI based on Cockpit

%prep
%setup

%build
%{makedocs}
gzip -v root/usr/share/cockpit/nethserver/libs/*.js
perl createlinks

%install
(cd root ; find . -depth -not -name '*.orig' -print | cpio -dump %{buildroot})
mkdir -p %{buildroot}/usr/share/cockpit/nethserver/
tar xvf %{SOURCE1} -C %{buildroot}/usr/share/cockpit/nethserver/
mkdir -p %{buildroot}/usr/libexec/nethserver/
mv api/ %{buildroot}/usr/libexec/nethserver/
%{genfilelist} %{buildroot} > filelist

%files -f filelist

%license COPYING
%doc README.rst
%config /etc/sudoers.d/30_cockpit
%config /etc/nethserver/cockpit/authorization/roles.json
%config /usr/share/cockpit/nethserver/categories/categories.json
%dir %{_nseventsdir}/%{name}-update
%dir /usr/libexec/nethserver/api/

%changelog
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
