<?php
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

/** Include helper functions **/

require_once("/usr/libexec/nethserver/api/lib/Helpers.php");

/* Return the groups of a user */
function user_membership($user) {
    $output = shell_exec("/usr/libexec/nethserver/list-user-membership -s '$user'");
    return json_decode($output,TRUE);
}

/* Return the list of users inside a group */
function group_members($group) {
    $output = shell_exec("/usr/libexec/nethserver/list-group-members -s '$group'");
    return json_decode($output,TRUE);
}

/* Return user information */
function user_info($user) {
    $output = shell_exec("/usr/libexec/nethserver/list-users -s '$user'");
    $tmp = json_decode($output,TRUE);
    return @$tmp[$user];
}

/* Return the list of existing users */
function list_users() {
    $output = shell_exec("/usr/libexec/nethserver/list-users -s");
    return array_keys(json_decode($output,TRUE));
}

/* Return the list of existing groups */
function list_groups() {
    $output = shell_exec("/usr/libexec/nethserver/list-groups -s");
    return array_keys(json_decode($output,TRUE));
}

/* Remove a user from a group, only if the user is part of the group */
function cleanup_group($group, $user) {
    $ret = 0;
    $members = group_members($group);
    # update the group if user was present in it
    if (in_array($user, $members)) {
        $members = array_diff($members, array($user));
        $cmd = "/sbin/e-smith/signal-event -j group-modify '$group' ";
        foreach ($members as $m) {
            $cmd .= " ".escapeshellarg($m);
        }
        passthru($cmd, $tmp_ret);
        $ret += $tmp_ret;
    }

    return $ret;
}

/* Remove a user from all existing groups */
function cleanup_groups($user) {
    $ret = 0;

    # remove deleted user from all groups
    foreach(list_groups() as $g) {
        $ret += cleanup_group($g, $user);
    }

    return $ret;
}


/* Add a user to a group */
function add_to_group($user, $group) {
    $ret = 0;
    $cmd = "/sbin/e-smith/signal-event -j group-modify '$group' ";
    $members = group_members($group);
    foreach ($members as $m) {
        $cmd .= " ".escapeshellarg($m);
    }
    $cmd .= " ".escapeshellarg($user);
    passthru($cmd, $ret);
    return $ret;
}

/* Add a user to a list of group */
function add_to_groups($user, $groups) {
    $ret = 0;

    foreach($groups as $g) {
        $ret += add_to_group($user, $g);
    }

    return $ret;
}

/* Set the user password 
 * The 'data' prameter must contain following fields
 *   - newPassword
 *   - confirmNewPassword
 *   - name
 */
function save_password($data) {
    $ret = 0;

    if (isset($data['newPassword']) && $data['newPassword']) {
        $db = new EsmithDatabase('configuration');
        $user = $data['name']."@".$db->getType('DomainName');
        $tmpFilePath = @tempnam(sys_get_temp_dir(), 'ng-');
        $tmpFile = fopen($tmpFilePath, 'w');
        fwrite($tmpFile, $data['newPassword']);
        fclose($tmpFile);

        passthru("/sbin/e-smith/signal-event -j password-modify $user $tmpFilePath", $ret);
    }

    return $ret;
}

