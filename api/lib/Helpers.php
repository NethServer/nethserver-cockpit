<?php
require_once("LegacyValidator.php");

/*
 * Copyright (C) 2018 Nethesis S.r.l.
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

/**
Library for PHP helpers
**/

/**
* Read JSON input from STDIN
* Exit with InvalidInput error if JSON can't be decoded.
* @return {JSON}
*/
function readInput()
{
    $data = NULL;
    $str = file_get_contents('php://stdin');
    $data = json_decode($str, TRUE);

    if (!$data) {
        echo json_encode(array(
            "id" => time(),
            "type" => 'InvalidInput',
            "message" => "No JSON data available"
        ));
        exit(1);
    }
    return $data;
}

/**
* Create a new validator using legacy code
* @param {JSON} JSON object wich rapresent all data to be validated.
* @return {Validator} a LegacyValidator object
*/
function createValidator($data)
{
    return new LegacyValidator($data);
}

/**
* Print a success return object and exit with 0 
*/
function success()
{
    echo json_encode(array("state" => "success"));
    exit(0);
}

/**
* Print all validation errors and exit with 1
* @param {Validator} or {Array} - optional
* 
* If argument is a Validator, generate a validation error and print all validation messages.
* Otherwise the argument should be an array in the form { type: 'ErrorType', message: 'Error message' }
* use the argument as generico error message.
* If no argument is given, raise a generic error.
*/
function error($arg = NULL)
{
    $error = array(
        "id" => time(),
        "type" => "GenericError",
        "message" => "Generic error"
    );
    if ($arg instanceof LegacyValidator) {
        $error = array(
            "id" => time(),
            "type" => 'NotValid',
            "message" => "Validation failed",
        );
        foreach ($arg->invalidParameters as $p => $v) {
            $error["attributes"][] = $v;
        }
    } else {
        if (isset($arg['type']) && isset($arg['message'])) {
            $error['message'] = $arg['message'];
            $error['type'] = $arg['type'];
        }
    }
    echo json_encode($error);
    exit(1);
}
