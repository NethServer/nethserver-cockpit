<?php
require_once("Validator.php");
require_once("EsmithDatabase.php");
/*
 * Copyright (C) 2011 Nethesis S.r.l.
 * 
 * This script is part of NethServer.
 * 
 * NethServer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NethServer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NethServer.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * 
 * 
 * @author Davide Principi <davide.principi@nethesis.it>
 * @since 1.0
 * @api
 */
class LegacyValidator
{
    /**
     * This collection holds the parameter values as primitive datatype or adapter objects.
     *
     * @api
     * @var \Nethgui\Adapter\ParameterSet
     */
    public $parameters;

    /**
     * Validator configuration. Holds declared parameters.
     * @var array
     */
    public $validators = array();

    /**
     * This array holds the names of parameters with validation errors.
     * @see prepareView()
     * @var array
     */
    public $invalidParameters = array();

    /**
     * @param string $identifier
     */
    public function __construct($data)
    {
        $this->parameters = $data;
    }

    /**
     * Declare a Module parameter.
     *
     * - A parameter is validated through $validationRule. It obtains its value
     *   from $valueProvider.
     * - A value provider can be a callback function or an adapter object.
     * - The callback function can return the parameter value or an adapter 
     *   itself. 
     *
     * NOTE: If you are using an adapter keep in mind that the
     * Host Configuration link is available after initialization only: don't
     * call in class constructor in this case!
     *
     * @see \Nethgui\System\PlatformInterface::getIdentityAdapter()
     * @see \Nethgui\System\PlatformInterface::getMapAdapter()
     *
     * @param string $parameterName The name of the parameter
     * @param mixed $validator Optional - A regular expression catching the correct value format OR An constant-integer corresponding to a predefined validator OR boolean FALSE for a readonly parameter
     * @param mixed $valueProvider Optional - A callback function, an adapter instance or an array of arguments to create an adapter
     * @return AbstractController
     */
    public function declareParameter($parameterName, $validator = FALSE)
    {
        if (is_string($validator) && $validator[0] == '/') {
            $validator = $this->createValidator()->regexp($validator);
        } elseif ($validator === FALSE) {
            $validator = $this->createValidator()->forceResult(FALSE);
        } elseif (is_integer($validator)) {
            $validator = $this->createValidator($validator);
        }

        // At this point $validator MUST be an object implementing the right interface
        if (! $validator) {
            throw new \InvalidArgumentException(sprintf('%s: Invalid validator instance for parameter `%s`', get_class($this), $parameterName), 1322149486);
        }

        $this->validators[$parameterName] = $validator;

        return $this;
    }


    /**
     * @param integer $ruleCode See \Nethgui\System\PlatformInterface::createValidator()
     * @return \Nethgui\System\Validator
     */
    public function createValidator($ruleCode = NULL)
    {
        $validator = new Validator($this);

        foreach (func_get_args() as $ruleCode) {
            switch ($ruleCode) {
                case Validate::ANYTHING:
                    $validator->forceResult(TRUE);
                    break;

                case Validate::ANYTHING_COLLECTION:
                    $validator->orValidator($this->createValidator()->isEmpty(), $this->createValidator()->collectionValidator($this->createValidator()->forceResult(TRUE)));
                    break;

                case Validate::USERNAME_COLLECTION:
                    $validator->orValidator($this->createValidator()->isEmpty(), $this->createValidator()->collectionValidator($this->createValidator()->username()));
                    break;

                case Validate::SERVICESTATUS:
                    $validator->memberOf('enabled', 'disabled');
                    break;

                case Validate::USERNAME:
                    $validator->username();
                    break;

                case Validate::HOSTNAME:
                    $validator->hostname();
                    break;

                case Validate::HOSTNAME_FQDN:
                    $validator->hostname(1);
                    break;

                case Validate::HOSTNAME_SIMPLE:
                    $validator->hostname(0, 0);
                    break;

                case Validate::HOSTADDRESS:
                    $validator->orValidator($this->createValidator()->ipV4Address(), $this->createValidator()->hostname());
                    break;

                case Validate::NOTEMPTY:
                    $validator->notEmpty();
                    break;

                case Validate::DATE:
                    $validator->date();
                    break;

                case Validate::TIME:
                    $validator->time();
                    break;

                case Validate::IP:
                case Validate::IPv4:
                    $validator->ipV4Address();
                    break;

                case Validate::NETMASK:
                case Validate::IPv4_NETMASK:
                    $validator->ipV4Netmask();
                    break;

                case Validate::MACADDRESS:
                    $validator->macAddress();
                    break;

                case Validate::POSITIVE_INTEGER:
                    $validator->integer()->positive();
                    break;

                case Validate::NONNEGATIVE_INTEGER:
                    $validator->integer()->greatThan(-1);
                    break;

                case Validate::PORTNUMBER:
                    $validator->integer()->greatThan(0)->lessThan(65536);
                    break;

                case Validate::BOOLEAN:
                    $validator->memberOf('1', 'yes', '0', '');
                    break;

                case Validate::IP_OR_EMPTY:
                case Validate::IPv4_OR_EMPTY:
                    $validator->orValidator($this->createValidator()->ipV4Address(), $this->createValidator()->isEmpty());
                    break;

                case Validate::NETMASK_OR_EMPTY:
                case Validate::IPv4_NETMASK_OR_EMPTY:
                    $validator->orValidator($this->createValidator()->ipV4Netmask(), $this->createValidator()->isEmpty());
                    break;

                case Validate::YES_NO:
                    $validator->memberOf('yes', 'no');
                    break;

                case Validate::EMAIL:
                    $validator->email();
                    break;

                case Validate::EMPTYSTRING:
                    $validator->maxLength(0);
                    break;

                case Validate::CIDR_BLOCK:
                    $validator->cidrBlock();
                    break;

                case Validate::NULL:
                    continue;

                default:
                    throw new \InvalidArgumentException(sprintf('%s: Unknown validator code: %s', get_class($this), $ruleCode), 1326380984);
            }
        }
        return $validator;
    }


    public function validate()
    {
        $valid = true;
        foreach ($this->parameters as $parameterName => $value) {

            // if no validator, just pass the validation
            if ( ! isset($this->validators[$parameterName])) {
                continue;
            }

            $validator = $this->validators[$parameterName];

            $isValid = $validator->evaluate($value);
            $valid = $valid && $isValid;
            if ($isValid !== TRUE) {
                $info = $validator->getFailureInfo();
                $this->invalidParameters[$parameterName] = array("parameter" => $parameterName, "value" => $value, "error" => @$info[0][0]); 
            }
        }
        if (count(array_keys($this->invalidParameters)) > 0) {
            return false;
        } else {
            return $valid;
        }
    }

    public function addValidationError($parameterName, $message, $value = null)
    {
        // backword compatibility
        if ($value instanceof ValidatorInterface) {
            $info = $validator->getFailureInfo();
            $this->invalidParameters[$parameterName] = array("parameter" => $parameterName, "value" => $value, "error" => @$info[0][0]);
        } else {
            $this->invalidParameters[$parameterName] = array("parameter" => $parameterName, "value" => $value, "error" => $message);
        }
    }

}
