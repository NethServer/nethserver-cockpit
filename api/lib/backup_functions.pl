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
use File::Temp;
use JSON;

require '/usr/libexec/nethserver/api/lib/helper_functions.pl';

sub set_backup
{
    my $input = shift;

    my $args = $input->{'name'};
    my $db = esmith::ConfigDB->open('backups');
    my $r = $db->get($input->{'name'});
    if (!$r) {
        $db->set_value($input->{'name'}, $input->{'engine'}, create => 1);
        $r = $db->get($input->{'name'})
    }
    delete($input->{'name'});
    delete($input->{'engine'});

    # create sftp credential file (it will be deleted by the action)
    if ($input->{'VFSType'} eq 'sftp') {
        my $pass_file = File::Temp->new(UNLINK => 0);
        print $pass_file $input->{'SftpPassword'};
        $args .= " ".$pass_file->filename;
        delete($input->{'SftpPassword'});
    }
    foreach my $k (keys %$input) {
        $r->set_prop($k, $input->{$k});
    }
    system("/sbin/e-smith/signal-event -j nethserver-backup-data-save $args");
    if ($? > 0) {
        error();
    } else {
        success();
    }
}
