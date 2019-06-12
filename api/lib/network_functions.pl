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
use esmith::ConfigDB;
use JSON;

require '/usr/libexec/nethserver/api/lib/helper_functions.pl';

sub has_provider
{
    my $interface = shift;
    my $db = shift;

    foreach ($db->get_all_by_prop('type' => 'provider')) {
        if ($_->prop('interface') eq $interface) {
            return 1;
        }
    }
    return 0;
}

sub cleanup_providers
{
    my $interface = shift;
    my $db = shift;

    foreach ($db->get_all_by_prop('type' => 'provider')) {
        if (($_->prop('interface') || '') eq $interface) {
            $_->delete();
        }
    }
}

sub create_provider
{
    my $interface = shift;
    my $db = shift;

    if (!has_provider($interface, $db)) {
        my $max = scalar $db->get_all_by_prop('type' => 'provider');
        my $name = "red".($max+1);
        # find free provider name
        while ($db->get($name)) {
            $max++;
            $name = "red$max";
        }
        $db->new_record($name, {'type' => 'provider', 'weight' => 1, 'interface' => $interface});
    }
}


