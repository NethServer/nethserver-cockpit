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

    my $name = $input->{'name'};
    my $args = $name;
    my $db = esmith::ConfigDB->open('backups');
    my $r = $db->get($name);
    if ($r) {
        $r->set_prop('type', $input->{'engine'});
    } else {
        $db->set_value($name, $input->{'engine'}, create => 1);
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
        $db->set_prop($name, $k, $input->{$k});
    }
    system("/sbin/e-smith/signal-event -j nethserver-backup-data-save $args");
    if ($? > 0) {
        # rollback: delete backup record and clean expanded templates
        my $b = $db->get($name);
        $b->delete();
        system("/sbin/e-smith/signal-event nethserver-backup-data-save $name");

        error();
    } else {
        success();
    }
}
