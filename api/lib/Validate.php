<?php

/*
Class for backward-compatibility.
*/

class Validate {

    /**
     * A valid service status is a 'disabled' or 'enabled' string.
     * @api
     */
    const SERVICESTATUS = 1248968160;

    /**
     * A valid *nix username token
     * @api
     */
    const USERNAME = 1248968161;

    /**
     * A not empty value
     * @api
     */
    const NOTEMPTY = 1248968162;

    /**
     * Accepts any value
     * @api
     */
    const ANYTHING = 1248968163;

    /**
     * Accept a value that represents a collection of any thing
     * @api
     */
    const ANYTHING_COLLECTION = 1248968164;

    /**
     * Accept a value that represents a collection of any Unix usernames
     * @api
     */
    const USERNAME_COLLECTION = 1248968165;

    /**
     * Accept positive integer
     * @api
     */
    const POSITIVE_INTEGER = 1248968166;

    /**
     * Accept a non-negative integer, an integer greater than or equal to zero
     * @api
     */
    const NONNEGATIVE_INTEGER = 1366805296;
    /**
     * Valid generic hostname
     *
     * @api
     * @see #478
     */
    const HOSTNAME = 1248968167;

    /**
     * Valid simple hostname without domain part
     * 
     * @api
     * @see #1052 
     */
    const HOSTNAME_SIMPLE = 1334736972;

    /**
     * Valid hostname with domain part (FQDN)
     * 
     * @api
     * @see #1052 
     */
    const HOSTNAME_FQDN = 1334741642;

    /**
     * Valid host name or ip address
     *
     * @api
     * @see #478
     */
    const HOSTADDRESS = 1248968168;

    /**
     * Valid date
     *
     * @api
     * @see #513
     */
    const DATE = 1248968169;

    /**
     * Valid time
     *
     * @api
     * @see #513
     */
    const TIME = 1248968170;

 /**
     * Boolean validator.
     * 
     * @api
     * '', '0', FALSE are FALSE boolean values. Other values are TRUE.
     */
    const BOOLEAN = 1248968171;

    /**
     * A valid IPv4 address like '192.168.1.1' 
     * 
     * @api
     */
    const IPv4 = 1248968172;

    /**
     * A valid IPv4 address like '192.168.1.1' ore empty
     * 
     * @api
     */
    const IPv4_OR_EMPTY = 1248968173;

    /**
     * A valid netmask address like '255.255.255.0' ore empty
     * 
     * @api
     */
    const NETMASK_OR_EMPTY = 1365512893;

    /**
     * Alias for VALID_IPv4 
     * 
     * @api
     */
    const IP = 1248968174;

    /**
     * Alias for VALID_IPv4_OR_EMPTY
     * 
     * @api
     */
    const IP_OR_EMPTY = 1248968175;

    /**
     * Alias for NETMASK_OR_EMPTY
     * 
     * @api
     */
    const IPv4_NETMASK_OR_EMPTY = 1365513038;
/**
     * A valid TCP/UDP port number 0-65535
     * 
     * @api
     */
    const PORTNUMBER = 1248968176;

    /**
     * A choice between 'yes' and 'no' values
     * 
     * @api
     */
    const YES_NO = 1248968177;

    /**
     * A valid ipv4 netmask address like '255.255.255.0'
     * 
     * @api
     */
    const IPv4_NETMASK = 1248968178;

    /**
     * Alias for VALID_IPv4_NETMASK
     * 
     * @api
     */
    const NETMASK = 1248968179;

    /**
     * A valid mac address like 00:16:3E:78:7A:7B
     * 
     * @api 
     */
    const MACADDRESS = 1248968180;

    /**
     * Valid email address 
     * 
     * A restricted set of RFC5322 dot-atom form (sect 3.4.1)
     * 
     * @api 
     */
    const EMAIL = 1340359603;

 /**
     * An empty string
     *
     * This is useful to compose _OR_EMPTY rules
     *
     * @api
     */
    const EMPTYSTRING = 1368694834;

    /**
     * CIDR block validator
     *
     * Eg 192.144.33.0/24
     *
     * @api
     */
    const CIDR_BLOCK = 1402048238;

}
