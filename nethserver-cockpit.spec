Name:           nethserver-cockpit
Version:        0.0.0
Release:        1%{?dist}
Summary:        NethServer Server Manager Web UI

License:        GPLv3
URL:            %{url_prefix}/%{name}
Source0:        %{name}-%{version}.tar.gz
# Execute prep-sources to create Source1 and Source2
Source1:        nethserver-cockpit-system.tar.gz
Source2:        nethserver-cockpit-applications.tar.gz
BuildArch:      noarch

BuildRequires:  nethserver-devtools
Requires:       cockpit, cockpit-storaged, cockpit-packagekit

%description
NethServer Server Manager Web UI based on Cockpit

%prep
%setup

%build
%{makedocs}
perl createlinks

%install
(cd root ; find . -depth -not -name '*.orig' -print | cpio -dump %{buildroot})
mkdir -p %{buildroot}/usr/share/cockpit/nethserver-system/
mkdir -p %{buildroot}/usr/share/cockpit/nethserver-applications/
tar xvf %{SOURCE1} -C %{buildroot}/usr/share/cockpit/nethserver-system/
tar xvf %{SOURCE2} -C %{buildroot}/usr/share/cockpit/nethserver-applications/
%{genfilelist} %{buildroot} > filelist

%files -f filelist

%license COPYING
%doc README.md
%dir %{_nseventsdir}/%{name}-update

%changelog
* Fri Sep 15 2017 Edoardo Spadoni <edoardo.spadoni@nethesis.it> - 0.0.0-1.ns7
- Initial version
