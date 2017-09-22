Name:           nethserver-cockpit
Version:        0.0.0
Release:        1%{?dist}
Summary:        NethServer Server Manager Web UI

License:        GPLv3
URL:            %{url_prefix}/%{name}
Source0:        %{name}-%{version}.tar.gz
# Execute prep-sources to create Source1 and Source2
Source1:        nethserver-cockpit-api.tar.gz
Source2:        nethserver-cockpit-ui.tar.gz
BuildArch:      noarch

BuildRequires:  nethserver-devtools
Requires:       cockpit

%description
NethServer Server Manager Web UI based on Cockpit

%prep
%setup

%build
%{makedocs}
perl createlinks

%install
(cd root ; find . -depth -not -name '*.orig' -print | cpio -dump %{buildroot})
mkdir -p %{buildroot}/usr/share/cockpit/nethserver/
tar xvf %{SOURCE1} -C %{buildroot}/usr/share/cockpit/nethserver/
tar xvf %{SOURCE2} -C %{buildroot}/usr/share/cockpit/nethserver/
%{genfilelist} %{buildroot} > filelist

%files -f filelist

%license COPYING
%doc README.rst
%dir %{_nseventsdir}/%{name}-update

%changelog
* Fri Sep 15 2017 Davide Principi <davide.principi@nethesis.it> - 0.0.0-1.ns7
- Initial version
