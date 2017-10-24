/*
 * Copyright (C) 2017 Nethesis S.r.l.
 * http://www.nethesis.it - nethserver@nethesis.it
 *
 * This script is part of NethServer.
 *
 * NethServer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * NethServer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with NethServer.  If not, see COPYING.
 */

(function(nethserver, cockpit){
    // Avoid double-inclusion from sub frames
    if(nethserver.system.users) {
        return;
    }

    var _ = cockpit.translate;

    /*
     * Returns the elements of a1 that are not in a2
     */
    function arrayDiff(a1, a2) {
        return a1.filter(function(item){
            if(a2.indexOf(item) >= 0) {
                return true;
            }
            return false;
        });
    }

    function saveGroups(user) {
        return nethserver.system.users.getUserMembership(user.key).
        then(function(curGroups){
            var bigPromise = Promise.resolve(); // the head of a promises chain
            var curPromise = bigPromise;

            // iterate over added groups and chain promises:
            arrayDiff(user.groups, curGroups).forEach(function(group){
                curPromise = curPromise.
                then(function(){
                    return nethserver.system.users.getGroupMembers(group);
                }). // appends members retriever
                then(function(members){
                    return nethserver.signalEvent('group-modify', [group, user.key].concat(members));
                }); // appends group updater
            });

            // iterate over removed groups and chain promises:
            arrayDiff(curGroups, user.groups).forEach(function(group){
                curPromise = curPromise.
                then(function(){
                    return nethserver.system.users.getGroupMembers(group);
                }). // appends members retriever
                then(function(members){
                    return nethserver.signalEvent('group-modify', [group].concat(arrayDiff(members, [user.key])));
                }); // appends group updater
            });

            return bigPromise;
        });
    }

    /**
     * @namespace
     */
    nethserver.system.users = {

        /**
         * Get the list of users
         * @see {@link #getUser} for output format
         *
         * @example
         * nethserver.system.users.getUsers().then(function(users) {
         *    // print users
         * });
         *
         * @param {Integer} [timeout=5] - Script timeout, default to 5 seconds
         *
         * @return {Promise} - A standard promise with the list of users
         */
        getUsers: function(timeout) {
            var t  = timeout || 5;
            return Promise.resolve(
                cockpit.spawn(['/usr/libexec/nethserver/list-users', '-t', t, '-s'])
            ).then(function(val) {
                return JSON.parse(val);
            });
        },

        /**
         * Get information on the given user
         *
         * @example
         * nethserver.system.users.getUser(myuser).then(function(user) {
         *    // print user
         * });
         * //Output:
         * {
         *     "myuser": {
         *         "expired": 0,
         *         "expires": "no",
         *         "gecos": "Name Surname",
         *         "locked": 0,
         *         "new": 0,
         *         "shell": "/bin/false"
         *     }
         * }
         *
         * @param {String} user - Name of the user
         * @param {Integer} [timeout=5] - Script timeout, default to 5 seconds
         *
         * @return {Promise.<User>} - A standard promise with the given user
         */
        getUser: function(user, timeout) {
            var t  = timeout || 5;
            return Promise.resolve(
                cockpit.spawn(['/usr/libexec/nethserver/list-users', '-t', t, '-s', user])
            ).then(function(val) {
                return JSON.parse(val);
            });
        },

        /**
         * Get list of groups for the given user
         *
         * @example
         * nethserver.system.users.getUserMembership(myuser).then(function(groups) {
         *    // print groups
         * });
         * //Output
         * [ 'g1', 'g2' ... ]
         *
         * @param {String} user - Name of the user
         *
         * @return {Promise.<Array>} - A standard promise with a list of groups
         */
        getUserMembership: function(user) {
            return Promise.resolve(
                cockpit.spawn(['/usr/libexec/nethserver/list-user-membership', '-s', user])
            ).then(function(val) {
                return JSON.parse(val);
            });
        },

        /**
         * Get the list of groups
         * @see {@link #getGroup} for output format
         *
         * @example
         * nethserver.system.users.getGroups().then(function(groups) {
         *    // print grpups
         * });
         *
         * @param {Integer} [timeout=5] - Script timeout, default to 5 seconds
         *
         * @return {Promise} - A standard promise with the list of groups
         */
        getGroups: function(timeout) {
            var t  = timeout || 5;
            return Promise.resolve(
                cockpit.spawn(['/usr/libexec/nethserver/list-groups', '-t', t, '-s'])
            ).then(function(val) {
                return JSON.parse(val);
            });
        },

        /**
         * Get user list of the given group
         *
         * @example
         * nethserver.system.users.getGroupMembers(mygroup).then(function(users) {
         *    // print users of th group
         * });
         * //Output:
         * ["user1","user2", ..]
         *
         * @param {String} group - Name of the group
         * @param {Integer} [timeout=5] - Script timeout, default to 5 seconds
         *
         * @return {Promise.<Array>} - A standard promise with the list of users
         */
        getGroupMembers: function(group, timeout) {
            var t  = timeout || 5;
            return Promise.resolve(
                cockpit.spawn(['/usr/libexec/nethserver/list-group-members', '-t', t, '-s', group])
            ).then(function(val) {
                return JSON.parse(val);
            });
        },

        /**
         * Create a new group
         *
         * @example
         * nethserver.system.users.createGroup({ key: 'mynewgroup', 'members': ['user1', 'user2', .. ] }).then(function() {
         *   ...
         * });
         *
         * @param {Object} group - Group to be added
         *
         * @return {Promise} - A promise on success, throws an error otherwise
         */
        addGroup: function(group) {
            return this.getGroups().then(function(groups) {
                for (var key in groups) {
                    if (key == group.key) {
                        throw new nethserver.Error({
                            id: 1150823484726,
                            type: 'NotValid',
                            attributes: {
                                'key': 'The group already exists',
                            }
                        });
                    }
                }
            }).then(function() {
                var params = [group.key];
                for (var i in group.members) {
                    params.push(group.members[i]);
                }
                nethserver.signalEvent('group-create', params);
            });
        },


        /**
         * Edit an existing group
         *
         * @example
         * nethserver.system.users.editGroup({ key: 'mynewgroup', 'members': ['user1', 'user2', .. ] }).then(function() {
         *   ...
         * });
         *
         * @param {Object} group - Group to be modified
         *
         * @return {Promise} - A promise on success, throws an error otherwise
         */
        editGroup: function(group) {
            return this.getGroups().then(function(groups) {
                var found = 0;
                for (var key in groups) {
                    if (key == group.key) {
                        found = 1;
                    }
                }
                if (!found) {
                    throw new nethserver.Error({
                        id: 1508235770438,
                        type: 'NotFound',
                        attributes: {
                            'key': 'Group not found',
                        }
                    });
                }
            }).then(function() {
                var params = [group.key];
                for (var i in group.members) {
                    params.push(group.members[i]);
                }
                nethserver.signalEvent('group-modify', params);
            });
        },

        /**
         * Delete an existing group
         *
         * @example
         * nethserver.system.users.deleteGroup('mynewgroup').then(function() {
         *   ...
         * });
         *
         * @param {String} group - Group to be deleted
         *
         * @return {Promise} - A promise on success, throws an error otherwise
         */
        deleteGroup: function(group) {
            return this.getGroups().then(function(groups) {
                var found = 0;
                for (var key in groups) {
                    if (key == group) {
                        found = 1;
                    }
                }
                if (!found) {
                    throw new nethserver.Error({
                        id: 1508235808102,
                        type: 'NotFound',
                        attributes: {
                            'key': 'Group not found',
                        }
                    });
                }
            }).then(function() {
                nethserver.signalEvent('group-delete', [group]);
            });
        },

        /**
         * Set the password for the given user account name
         *
         * @param {string} user - the short user name (without domain suffix)
         * @param {string} password - the password
         * @returns {Promise}
         */
        setPassword: function(user, password) {
            var tmpdump = "FILE=$(mktemp --tmpdir tmppass.XXXXXXXXXX)\n" +
                "cat - > ${FILE}\n" +
                "echo -n ${FILE}\n";

            var tmpFile;
            function cleanupTemp(files) {
                return Promise.resolve(cockpit.spawn(['/usr/bin/rm', '-f'].concat(files)));
            }

            return Promise.resolve(cockpit.script(tmpdump).input(password)).
            then(function(tmpf){
                tmpFile = tmpf;
                return nethserver.validate('password-strength', ['Users', tmpFile], {
                    id: 1508425739146,
                    type: 'NotValid',
                    message: _('The given password does not meet the current policy'),
                });
            }).
            then(function(){
                return nethserver.system.hostname.getDomainName();
            }).
            then(function(domainName){
                return nethserver.signalEvent('password-modify', [user + '@' + domainName, tmpFile]);
            }).
            then(function(){
                cleanupTemp([tmpFile]);
            }, function(ex){
                cleanupTemp([tmpFile]);
                throw ex;
            });
        },

        /**
         * Crate a new user
         *
         * @example
         * return nethserver.system.users.addUser({
         *     "key": "myuser", // without domain suffix
         *     "expires": "no",
         *     "gecos": "Name Surname",
         *     "shell": "/bin/false",
         *     "groups": ["thisgroup", "thatgroup"],
         * }).
         * then(function() {
         *    return nethserver.system.users.setPassword('myuser', 'password')
         * });
         *
         * @param {UserDetails} user - User to be added
         *
         * @return {Promise} - A promise on success, throws an error otherwise
         */
        addUser: function(user) {
            return this.getUser(user.key).then(function(obj) {
                if(obj.hasOwnProperty(user.key)) {
                    throw new nethserver.Error({
                        id: 1150824817076,
                        type: 'NotValid',
                        attributes: {
                            'key': _('User already exists'),
                        }
                    });
                }
                return nethserver.signalEvent('user-create', [user.key, user.gecos, user.shell]);
            }).
            then(function(){
                return saveGroups(user);
            }).
            then(function(){
                return nethserver.signalEvent('password-policy-update', [user.key, user.expires]);
            });
        },

        /**
         * Edit an existing user
         *
         * @see {@link #addUser}
         * @param {UserDetails} user - User to be added
         * @return {Promise} - A promise on success, throws an error otherwise
         */
        editUser: function(user) {
            return this.getUser(user).then(function(obj) {
                if ( ! obj.hasOwnProperty(user.key)) {
                    throw new nethserver.Error({
                        id: 1508246624788,
                        type: 'NotFound',
                        attributes: {
                            'key': _('User not found'),
                        }
                    });
                }
                return nethserver.signalEvent('user-modify', [user.key, user.gecos, user.shell]);
            }).
            then(function(){
                return saveGroups(user);
            }).
            then(function(){
                return nethserver.signalEvent('password-policy-update', [user.key, user.expires]);
            });
        },

        /**
         * Delete an existing user
         *
         * @example
         * nethserver.system.users.deleteUser('myuser').then(function() {
         *   ...
         * });
         *
         * @param {String} user - User to be deleted
         *
         * @return {Promise} - A promise on success, throws an error otherwise
         */
        deleteUser: function(user) {
            return this.getUser(user).then(function(obj) {
                if ($.isEmptyObject(obj)) {
                    throw new nethserver.Error({
                        id: 1508246496389,
                        type: 'NotFound',
                        attributes: {
                            'key': 'User not found',
                        }
                    });
                }
            }).then(function() {
                nethserver.signalEvent('user-delete', [user]);
            });
        },


        /**
         * Generate a srong random password using mkpasswd
         *
         * @return {String} - A random strong password
         */
        mkpasswd: function() {
            return Promise.resolve(
                cockpit.spawn(['mkpasswd'])
            );
        }
    };
}(nethserver, cockpit));
