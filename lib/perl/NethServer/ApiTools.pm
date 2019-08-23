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
package NethServer::ApiTools;
use Exporter 'import';
our @EXPORT_OK = qw(hints success error readInput safe_decode_json invoke_info_api);

#
# Basic helper functions for cockpit
#

use warnings;
use JSON;
use esmith::ConfigDB;

#
# Print a hints object
# Parameters:
# - message: a general hint message
# - details: an hashmap reference, the map must be in the form {"prop1" => "hint_ message1", ... }
# - link: an url to external doc
#
sub hints
{
    my $ret = {count => 0, message => undef, details => undef, link => undef};
    my ($message, $details, $link) = @_;

    # this check is usefull when the code is runnin as non-root user
    my $db = esmith::ConfigDB->open_ro();
    if (!$db) {
        print encode_json($ret);
        exit 0;
    }
    my $show_hints = $db->get_prop("cockpit.socket", "ShowHints") || "disabled";
    if ($show_hints ne 'enabled') {
        print encode_json($ret);
        exit 0;
    }

    if (defined($link)) {
        $ret->{'link'} = $link;
    }
    if (defined($message) && $message ne '') {
        $ret->{'count'} = 1;
        $ret->{'message'} = $message;
    }
    if (defined($details) && scalar(keys %$details)) {
        $ret->{'count'} = scalar(keys %$details);
        $ret->{'details'} = $details;
    }
    print encode_json($ret);
    exit 0;
}

#
# Print a success JSON object and exit 0
#
sub success
{
    printf '{"state":"success"}';
    exit 0
}

#
# Print a JSON error and exit 1
# Takes 2 arguments:
#   - the error type (default: GenericError)
#   - a message (default "Generic error")
#
sub error
{
    my $type = shift || 'GenericError';
    my $msg = shift || 'generic_error';
    print encode_json({ 'id' => time, 'type' => $type, 'message' => $msg });
    exit 1;
}

#
# Read JSON input from STDIN
# Exit with InvalidInput error if JSON can't be decoded.
#
sub readInput
{
    my $str = do { local $/; <STDIN> };

    eval {
        # check if input is a valid JSON
        my $ref = decode_json($str) || undef;
        return $ref;
    } or do {
        error('InvalidInput', 'no_json_data_available');
    };

}

#
# Try to decode a json string, return a default if fails
#
sub safe_decode_json
{
    my $str = shift;
    my $default = shift;
    if( ! defined $default) {
        $default = {};
    }

    my $ret;
    eval { $ret = decode_json($str); };
    if($@) {
        return $default;
    }
    return $ret;
}

#
# Execute a command with arguments, capturing stdout.
# This is equivalent of Perl qx() without intermediate shell invocation.
# Exit code available in $?, last call status in $!, as usual.
#
sub exec_slurp
{
    local $/ = undef;
    open(my $fh, '-|', @_);
    my $data = <$fh>;
    close($fh);
    return $data;
}

#
# Safely execute the the "validate" command. It returns a list with
# 1. the numeric exit code returned by validate
# 2. the validate output
#
sub platform_validator
{
    my $message = exec_slurp('/sbin/e-smith/validate', @_);
    chomp($message);
    my $exitCode = 0;
    if($!) {
        warn("[ERROR] platform_validator: $!");
        $exitCode = 1;
    } elsif($? ne 0) {
        $exitCode = $? >> 8;
    }
    return ($exitCode, $message);
}

#
# Retrieve information about a Cockpit application
# 
sub invoke_info_api
{
    use IPC::Open2;
    my $helper_path = shift;
    my $helper_input = shift;
    my $input = shift;
    my($chld_out, $chld_in, $pid);

    $helper_input = {%$input, 'action' => 'app-info', %$helper_input}; # merges the input hashes
    $pid = open2($chld_out, $chld_in, $helper_path);
    print $chld_in encode_json($helper_input);
    close($chld_in);
    my $raw_response = <$chld_out>;
    close($chld_out);
    waitpid( $pid, 0 );
    return safe_decode_json($raw_response);
}


1;
