#!/usr/bin/perl

#
# Copyright (C) 2018 Nethesis S.r.l.
# http://www.nethesis.it - nethserver@nethesis.it
#
# This script is part of NethServer.
#
# NethServer is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License,
# or any later version.
#
# NethServer is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with NethServer.  If not, see COPYING.
#

use strict;
use warnings;
use JSON;

sub read_json
{
    my $file = shift || return undef;
    return undef if (! -e $file);

    my $json;
    {
        local $/; #Enable 'slurp' mode
        open my $fh, "<", $file or return undef;
        $json = <$fh>;
        close $fh;
    }

    return decode_json($json);
}

# encode json data and write to file ($umask optional)
# write_json ($file,$data,$umask)
sub write_json {

      my $file = shift || warn 'No specified file to write';
      my $dirname = dirname($file);
      if (! -d $dirname) {
          warn 'No directory to save the json file'
      }
      my $data = shift || warn 'No data to encode to json';
      my $umask = shift || 022;

      umask $umask;
      open my $fh, ">", $file || return 0;
      print $fh encode_json($data);
      close $fh;
      return 1;
}

sub whoami
{
    my $user = scalar getpwuid $<;
    # strip domain
    $user =~ s/@.*$//;
    return $user;
}

sub list_applications
{
    my @apps;
    foreach my $manifest (glob("/usr/share/cockpit/nethserver/applications/*.json")) {
        my $app = read_json($manifest);
        push(@apps, $app->{'id'});
    }
    return @apps;
}

sub isAdmin
{
    my $user = shift;
    my @roles = sudo ($user);
    my $isAdmin = 0;
    # when user is delegated to settings -> member of admin groups
    my %hash = map {$_ => 1} @roles;
    $isAdmin = 1 if (defined $hash{'system-settings'})
}

sub get_acl
{
    my $user = shift;
    my $ret = {"system" => [], "applications" => []};

    my @roles = sudo($user);
    my %controllers = (
        'system-users' => ["users-groups"],
        'system-certificate' => ["certificates"],
        'system-openssh'          => ["ssh"],
    );
    foreach my $role (@roles) {
        if (! exists $controllers{$role}){
            if ($role =~ /^nethserver-/) {
                push($ret->{"applications"}, $role)
            } else {
                $role  =~ s/system-//;
                push($ret->{"system"}, $role);
            }
        } else {
            foreach my $api (@{$controllers{$role}}) {
                push ($ret->{"system"}, $api);
            }
        }
    }
    return $ret;
}


sub list_system_routes
{
    my $ret = read_json("/etc/nethserver/cockpit/authorization/system-routes.json");
    return @$ret;
}

sub in_array {
    my (@arr,$search_for) = @_;
    return grep {$search_for eq $_} @arr;
}

sub uniq {
  my %seen;
  return grep { !$seen{$_}++ } @_;
}

sub sudo 
{
    my $user = shift;
    my @sudo = `/usr/bin/sudo -ll -U $user`;
    @sudo = uniq(@sudo);
    my @commands = ();

    foreach (@sudo) {
        # clean up sudo -ll
        $_ =~ s/\t//g;
        $_ =~ s/ //g;
        $_ =~ s/\n//g;
        next if ($_ =~ /!requiretty/);
        next if ($_ !~ /\/usr\/libexec\/nethserver\/api\//);
        $_ =~ s/\/usr\/libexec\/nethserver\/api\///;
    
        # we do not need this, multiple api for one delegation
        next if ($_ =~ /system-apps/); # needed for shortcut
        next if ($_ =~ /system-routes/); # needed by network
        next if ($_ =~ /system-hosts/); # needed by dns
        next if ($_ =~ /system-proxy/); # needed by network
    
        if (
           ($_ =~ /\w+\/update/) ||
           ($_ =~ /system-logs\/execute/) ||
           ($_ =~ /\w+\/dashboard\/read/) ) {
                #Clean all path, let the directory name
                $_ =~ s/\/\w+//g;
                $_ =~ s/\/+$//g;
                push @commands,  $_;
           }
    }
    return uniq (@commands);
}

1