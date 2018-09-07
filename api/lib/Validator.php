<?php
require("Validate.php");
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
 * Test if an input value is grammatically and/or logically valid
 *
 * WARNING: implementors must also implement isMandatory() method!
 * This interface will be merged with MandatoryValidatorInterface
 *
 * @see MandatoryValidatorInterface
 * @author Davide Principi <davide.principi@nethesis.it>
 * @since 1.0
 * @api
 */
interface ValidatorInterface {

    /**
     * Test if $value is accepted by this validator.
     *
     * @api
     * @param mixed $value
     * @return boolean
     */
    public function evaluate($value);

    /**
     * Tells why validation failed
     * 
     * If evaluate() returns FALSE the validator object must return
     * an explanation of the problem as an array of arrays.
     * 
     * @api
     * @see evaluate()
     * @return array An array of arrays of two elements: a template string and an array of arguments, to invoke strtr().
     */
    public function getFailureInfo();
}

/**
 * This interface will be merged into ValidatorInterface
 *
 * @api
 * @since 1.3
 * @deprecated
 * @author Davide Principi <davide.principi@nethesis.it>
 */
interface MandatoryValidatorInterface extends ValidatorInterface
{

    /**
     * Tell if an empty value is NOT allowed.
     *
     * @api
     * @return boolean FALSE if empty is allowed, TRUE otherwise.
     */
    public function isMandatory();
}

/**
 * Check a list of conditions that must be satisfied.
 *
 * @author Davide Principi <davide.principi@nethesis.it>
 */
class Validator implements MandatoryValidatorInterface
{
    private $chain = array();
    private $failureInfo;

    public function __construct()
    {
    }

    /**
     *
     * @param ValidatorInterface $v1
     * @param ValidatorInterface $v2
     * @return Validator
     */
    public function orValidator(ValidatorInterface $v1, ValidatorInterface $v2)
    {
        $this->chain[] = new OrValidator($v1, $v2);
        return $this;
    }

    /**
     * If the first and only argument is an array checks if current value is
     * in that array.
     *
     * Otherwise you can pass arbitrary arguments. It will be checked if the
     * current value matches any of them.
     *
     * @return  Validator
     */
    public function memberOf()
    {
        $args = func_get_args();

        if (isset($args[0]) && is_array($args[0]) && count($args) == 1) {
            $set = $args[0];
        } else {
            $set = $args;
        }

        if (count($set) > 5) {
            $setToShow = array_slice($set, 0, 3);
            $setToShow[] = '... ';
            $setToShow = array_merge($setToShow, array_slice($set, -2, 2));
        } else {
            $setToShow = $set;
        }

        $messageTemplate = array('valid_memberOf', array(implode(', ', $setToShow)));

        return $this->addToChain(__FUNCTION__, $messageTemplate, $set);
    }

    /**
     * @see preg_match
     * @param string $e A PHP preg_match compatible regular expression
     * @param string $meaning The error message template
     * @return Validator
     */
    public function regexp($e, $meaning='valid_regexp')
    {
        $messageTemplate = array($meaning, array($e));
        return $this->addToChain(__FUNCTION__, $messageTemplate, $e);
    }

    /**
     * Checks if current value is not empty
     * 
     * @see PHP empty
     * @return Validator
     */
    public function notEmpty()
    {
        return $this->addToChain(__FUNCTION__);
    }

    /**
     * Checks if current value is empty
     * 
     * @see PHP empty
     * @return Validator
     */
    public function isEmpty()
    {
        return $this->addToChain(__FUNCTION__);
    }

    /**
     * Force the evaluation result
     * @param bool exit status
     * @return Validator
     */
    public function forceResult($result)
    {
        $this->chain[] = ($result === TRUE);
        return $this;
    }

    /**
     * Check if the given value is a valid IPv4 address
     * @return Validator
     */
    public function ipV4Address()
    {
        return $this->addToChain(__FUNCTION__);
    }

    /**
     * Check if the given value is a valid host name
     * @param int $minDots Default 0
     * @param int $maxDots Default PHP_INT_MAX
     * @return Validator
     */
    public function hostname($minDots = 0, $maxDots = PHP_INT_MAX)
    {
        if ($minDots > $maxDots) {
            throw new \LogicException(sprintf('%s: hostname validator: the minDots argument must be less than or equal to maxDots', __CLASS__), 1334737472);
        }

        $message = 'valid_hostname';
        if ($minDots === 0 && $maxDots === 0) {
            $message = 'valid_hostname_simple';
        } elseif ($minDots === 0 && $maxDots === PHP_INT_MAX) {
            $message = 'valid_hostname';
        } elseif ($minDots === 1 && $maxDots === PHP_INT_MAX) {
            $message = 'valid_hostname_fqdn';
        } elseif ($minDots > 1 && $maxDots === PHP_INT_MAX) {
            $message = 'valid_hostname_fqdn_long';
        } else {
            $message = 'valid_hostname_fqdn_exact';
        }

        return $this
                ->minLength(1)
                ->maxLength(255)
                ->addToChain(__FUNCTION__, array($message, array($minDots, $maxDots)), $minDots, $maxDots)
        ;
    }

    /**
     * @todo
     * @return Validator
     */
    public function ipV6Address()
    {
        return $this->notImplemented(__FUNCTION__);
    }

    /**
     * @todo
     * @return Validator
     */
    public function ipV4Netmask()
    {
        return $this->addToChain(__FUNCTION__);
    }

    /**
     * @todo
     * @return Validator
     */
    public function macAddress()
    {
        return $this->addToChain(__FUNCTION__);
    }

    /**
     * @todo
     * @return Validator
     */
    public function ipV6Netmask()
    {
        return $this->notImplemented(__FUNCTION__);
    }

    public function integer()
    {
        return $this->addToChain(__FUNCTION__);
    }

    public function positive()
    {
        return $this->addToChain(__FUNCTION__);
    }

    public function negative()
    {
        return $this->addToChain(__FUNCTION__);
    }

    public function lessThan($cmp)
    {
        $template = array('valid_lessThan', array($cmp));
        return $this->addToChain(__FUNCTION__, $template, $cmp);
    }

    public function greatThan($cmp)
    {
        $template = array('valid_greatThan', array($cmp));
        return $this->addToChain(__FUNCTION__, $template, $cmp);
    }

    public function equalTo($cmp)
    {
        $template = array('valid_equalTo', array($cmp));
        return $this->addToChain(__FUNCTION__, $template, $cmp);
    }

    public function minLength($length)
    {
        $template = array('valid_minLength', array($length));
        return $this->addToChain(__FUNCTION__, $template, $length);
    }

    public function maxLength($length)
    {
        $template = array('valid_maxLength', array($length));
        return $this->addToChain(__FUNCTION__, $template, $length);
    }

    /**
     * Invert the evaluation result for the next rule.
     * @return Validator
     */
    public function not()
    {
        $this->chain[] = -1;
        return $this;
    }

    /**
     * Check if the value is a valid Unix user name
     * @return Validator
     */
    public function username()
    {
        return $this->addToChain(__FUNCTION__);
    }

    /**
     * Valid date
     *
     * Default format is given by the current user language settings.
     *
     * @see #513
     */
    public function date($format = NULL)
    {
        if (is_null($format)) {
            $format = "YYYY-mm-dd";
        }

        $template = array('valid_date', array($format));
        return $this->addToChain(__FUNCTION__, $template, $format);
    }

    /**
     * Valid time 24-hours format HH:MM(:SS)?
     *
     * @see #513
     */
    public function time()
    {
        return $this->addToChain(__FUNCTION__);
    }

    /**
     * Check if the value is collection of elements satisfying the given validator
     * @param Validator $v Member validator
     * @return Validator 
     */
    public function collectionValidator(Validator $v)
    {
        $this->chain[] = new CollectionValidator($v);
        return $this;
    }

    /**
     * Invoke an external validation script
     * @param type $validatorName
     * @return Validator
     * @throws \InvalidArgumentException
     */
    public function platform($validatorName)
    {
        $arguments = func_get_args();

        if ( ! is_string($validatorName) && $validatorName !== '') {
            throw new \InvalidArgumentException(sprintf("%s: must supply a validator name argument", __CLASS__), 1333012309);
        }

        array_unshift($arguments, __FUNCTION__, FALSE);
        return call_user_func_array(array($this, 'addToChain'), $arguments);
    }

    /**
     * The restricted mail address validator
     * 
     * @see #1249
     * @return Validator
     */
    public function email()
    {
        return $this->addToChain(__FUNCTION__, FALSE);
    }


    public function cidrBlock()
    {
        return $this->addToChain(__FUNCTION__);
    }

    public function getFailureInfo()
    {
        return $this->failureInfo;
    }

    public function evaluate($value)
    {
        $this->failureInfo = array();

        if (empty($this->chain)) {
            return FALSE;
        }

        $notFlag = FALSE;

        foreach ($this->chain as $expression) {
            if (is_integer($expression) && $expression < 0) {
                // set $notFlag flag. Next $expression will be inverted: NOT(exp)
                $notFlag = TRUE;
                continue;
            } elseif (is_array($expression) && is_callable($expression[1])) {
                // $expression is an array of four elements
                // 0. the original method name, as a string
                // 1. a callable
                // 2. an optional array of arguments
                // 3. the error message template plus arguments

                list($methodName, $evalFunction, $argList, $errorTemplate) = $expression;

                if ( ! is_array($argList)) {
                    $argList = array();
                }

                array_unshift($argList, $value);

                $isValid = call_user_func_array($evalFunction, $argList);

                if (($isValid XOR $notFlag) === FALSE) {
                    if (is_array($errorTemplate)) {
                        $this->addFailureInfo($errorTemplate[0], $errorTemplate[1]);
                    }
                    return FALSE;
                }
            } elseif ($expression instanceof ValidatorInterface) {
                $isValid = $expression->evaluate($value);
                if (($isValid XOR $notFlag) === FALSE) {
                    $this->mergeFailureInfo($expression);
                    return FALSE;
                }
            } elseif ($expression === FALSE) {
                $this->addFailureInfo('valid_forced_failure');
                return FALSE;
            } elseif ($expression === TRUE) {
                break;
            }

            // reset $notFlag flag
            $notFlag = FALSE;
        }

        return TRUE;
    }

    protected function mergeFailureInfo(ValidatorInterface $validator)
    {
        foreach ($validator->getFailureInfo() as $elem) {
            $this->addFailureInfo($elem[0], $elem[1]);
        }
        return $this;
    }

    protected function addFailureInfo($template, $args = array())
    {
        if ( ! is_string($template)) {
            throw new \InvalidArgumentException(sprintf('%s: $template argument must be a string', __CLASS__), 1337766431);
        } elseif ( ! is_array($args)) {
            throw new \InvalidArgumentException(sprintf('%s: $args argument must be an array', __CLASS__), 1337766432);
        }
        $this->failureInfo[] = array($template, $args);
        return $this;
    }

    /**
     * In development environment a not implemented rule is simply ignored,
     * otherwise an exception is raised.
     * 
     * @codeCoverageIgnore
     * @param string $method
     * @return Validator
     */
    private function notImplemented($method)
    {
        throw new \LogicException(sprintf('%s: %s() is not implemented.', get_class($this), $method), 1322150359);
    }

    /**
     * Add an eval function to the chain. 
     * 
     * The invoked function name is "eval" + $originalMethodName
     * 
     * The second argument is an array of two elements
     * 
     * - The message text template
     * 
     * - The array of placeholders for the template
     * 
     * If the 2nd argument is NULL generate a default template is generated. This
     * is for single failure reason.
     * 
     * If the 2nd argument is FALSE, you must provide the failure message in
     * the "eval*" function, calling addFailureInfo(). This is useful for multiple
     * failure reasons.
     * 
     * @param string the calling Method name
     * @param mixed Optional the default error message template: other values NULL and FALSE.
     * @param mixed Optional - First argument to evaluation function
     * @param mixed Optional - Second argument to evaluation function
     * @param mixed Optional - ...
     * @return Validator
     */
    private function addToChain($originalMethodName, $errorMessageTemplate = NULL)
    {
        $args = array_slice(func_get_args(), 2);

        // if only the method name is passed, add a default template
        if (is_null($errorMessageTemplate)) {
            $errorMessageTemplate = array('valid_' . $originalMethodName, array());
        }

        $methodName = 'eval' . ucfirst($originalMethodName);

        $this->chain[] = array(
            $originalMethodName, // 0 
            array($this, $methodName), // 1
            $args, // 2 
            $errorMessageTemplate, // 3
        );

        return $this;
    }

    private function evalNotEmpty($value)
    {
        if($value instanceof \Countable) {
            return $value->count() > 0;
        }
        return empty($value) ? FALSE : TRUE;
    }

    private function evalIsEmpty($value)
    {
        if($value instanceof \Countable) {
            return $value->count() == 0;
        }
        return empty($value) ? TRUE : FALSE;
    }

    private function evalRegexp($value, $exp)
    {
        return (preg_match($exp, $value) > 0);
    }

    private function evalMemberOf($value, $args)
    {
        return in_array($value, $args, TRUE);
    }

    /**
     * Validate IP Address
     *
     * Updated version suggested by Geert De Deckere
     *
     * @access       public
     * @param        string
     * @return       string
     * @author CodeIgniter
     */
    private function evalIpV4Address($value)
    {
        $ip_segments = explode('.', $value);

        // Always 4 segments needed
        if (count($ip_segments) != 4) {
            return FALSE;
        }

        // Check each segment
        foreach ($ip_segments as $segment) {
            // IP segments must be digits and can not be
            // longer than 3 digits or greater then 255
            if ($segment == '' OR ! preg_match("/^(0|[1-9][0-9]?[0-9]?)$/", $segment) OR $segment > 255 OR strlen($segment) > 3) {
                return FALSE;
            }
        }

        return TRUE;
    }

    /**
     * Check if $value starts with a letter and contains only alphanumeric
     * characters plus "-", "_", "."
     * @param string $value 
     */
    private function evalUsername($value)
    {
        return strlen($value) < 256 && $this->evalRegexp($value, '/^[a-z][-_\.a-z0-9]*$/');
    }

    /**
     * Check if $value is a string of digits
     * @param string $value
     */
    private function evalInteger($value)
    {
        return preg_match('/^(0|-?[1-9][0-9]*)$/', $value) === 1;
    }

    private function evalNumeric($value)
    {
        return $this->evalInteger($value) || preg_match('/^-?(0|[1-9][0-9]*)\.[0-9]+$/', $value) === 1;
    }

    private function evalPositive($value)
    {
        return $this->evalNumeric($value) && $value > 0;
    }

    private function evalNegative($value)
    {
        return $this->evalNumeric($value) && $value < 0;
    }

    private function evalLessThan($value, $cmp)
    {
        return $this->evalNumeric($value) && ($value < $cmp);
    }

    private function evalGreatThan($value, $cmp)
    {
        return $this->evalNumeric($value) && ($value > $cmp);
    }

    private function evalEqualTo($value, $cmp)
    {
        return ($this->evalNumeric($value) && $value == $cmp) || strcmp($value, $cmp) === 0;
    }

    private function evalMinLength($s, $min)
    {
        if ( ! is_string($s)) {
            throw new \InvalidArgumentException(sprintf("%s: Invalid type `%s`. Value must be a string.", get_class($this), gettype($s)), 1322150360);
        }
        return strlen($s) >= $min;
    }

    private function evalMaxLength($s, $max)
    {
        if ( ! is_string($s)) {
            throw new \InvalidArgumentException(sprintf("%s: Invalid type `%s`. Value must be a string.", get_class($this), gettype($s)), 1322150361);
        }
        return strlen($s) <= $max;
    }

    private function evalHostname($value, $minDots, $maxDots)
    {
        $parts = explode('.', $value);

        $dotsCount = count($parts) - 1;

        if ($dotsCount < $minDots || $dotsCount > $maxDots) {
            return FALSE;
        }

        // letter-case ignored.
        // FIXME: allow underscore (_) in hostname?
        $pattern = '/^[a-z0-9]([-a-z0-9]*)$/i';

        foreach ($parts as $part) {
            if (strlen($part) > 63) {
                return FALSE;
            }

            if (preg_match($pattern, $part) == 0) {
                return FALSE;
            }
        }

        return TRUE;
    }

    private function evalDate($value, $format)
    {
        if ($format == 'dd/mm/YYYY') {
            list($day, $month, $year) = explode('/', $value) + array(0, 0, 0);
        } elseif ($format == 'mm-dd-YYYY') {
            list($month, $day, $year) = explode('-', $value) + array(0, 0, 0);
        } elseif ($format == 'YYYY-mm-dd') {
            list($year, $month, $day) = explode('-', $value) + array(0, 0, 0);
        } else {
            throw new \InvalidArgumentException(sprintf("%s: Unknown date format `%s`", get_class($this), $format), 1322150419);
        }

        return checkdate(intval($month), intval($day), intval($year));
    }

    private function evalTime($value)
    {
        $parts = array();
        $pattern = '|^(\d\d):(\d\d)(?:\:(\d\d))?$|';

        if (preg_match($pattern, $value, $parts) == 0) {
            return FALSE;
        };

        $parts = $parts + array('00', '00', '00');

        list($h, $m, $s) = array_map('intval', $parts);

        if (($h >= 0 && $h < 24)
            && ($m >= 0 && $m < 60)
            && ($s >= 0 && $s < 60)) {
            return TRUE;
        }

        return FALSE;
    }

    private function evalIpV4Netmask($value)
    {
        $pattern = '/^(((0|128|192|224|240|248|252|254)\.0\.0\.0)|(255\.(0|128|192|224|240|248|252|254)\.0\.0)|(255\.255\.(0|128|192|224|240|248|252|254)\.0)|(255\.255\.255\.(0|128|192|224|240|248|252|254|255)))$/i';
        return preg_match($pattern, $value);
    }

    private function evalMacAddress($value)
    {
        $pattern = '/^[0-9a-f]{2}(:[0-9a-f]{2}){5}$/i';
        return preg_match($pattern, $value);
    }

    private function prepareEscapedCommand($command, $arguments)
    {
        $escapedArguments = array();
        $i = 1;
        foreach ($arguments as $arg) {

            if (is_string($arg)) {
                $argOutput = $arg;
            } elseif (is_callable($arg)) {
                $argOutput = call_user_func($arg);
            } else {
                $argOutput = strval($arg);
            }

            $escapedArguments[sprintf('${%d}', $i)] = escapeshellarg($argOutput);
            $i ++;
        }
        $escapedArguments['${@}'] = implode(' ', $escapedArguments);

        return strtr($command, $escapedArguments);
    }

    private function evalPlatform($value)
    {
        $args = func_get_args();

        // remove the first argument: $value ..
        array_shift($args);

        // .. append to last position
        $args[] = $value;

        exec($this->prepareEscapedCommand('/usr/bin/sudo /sbin/e-smith/validate ${@}', $args), $outputArray, $exitCode);

        if ($exitCode !== 0) {
            $outputArray = $process->getOutputArray();
            $reason = array_pop($outputArray);
            $args['${reason}'] = substr(implode("\n", $outputArray), 0, 64);
            $this->addFailureInfo('valid_platform,' . $reason, $args);
        }

        return $exitCode === 0;
    }

    private function evalEmail($value)
    {
        if (\filter_var($value, \FILTER_VALIDATE_EMAIL) === FALSE) {
            $this->addFailureInfo('valid_email,generic_failure');
            return FALSE;
        }
        return TRUE;
    }

    private function evalCidrBlock($value)
    {
        $parts = explode('/', $value);
        $validMask = isset($parts[1]) && preg_match('/^[0-9]+$/', $parts[1]) && (($parts[1] > 1 && $parts[1] < 33) || $parts[1] === "0");
        return $validMask && $this->evalIpV4Address($parts[0]);
    }

    protected function setMandatoryConditional($value)
    {
        if ( ! isset($this->mandatory)) {
            $this->mandatory = $value;
        }
        return $this;
    }

    public function isMandatory()
    {
        $notFlag = FALSE;
        foreach ($this->chain as $expression) {
            if (is_integer($expression) && $expression < 0) {
                $notFlag = TRUE;
                continue;
            } elseif (is_array($expression) && is_callable($expression[1])) {
                list($methodName, $evalFunction, $argList, $errorTemplate) = $expression;

                if ( ! is_array($argList)) {
                    $argList = array();
                }
                
                if ($methodName === 'maxLength' && $argList[0] >= 0 ) {
                    return FALSE;
                } else {
                    return (preg_match('/^isEmpty$/', $methodName) === 0) XOR $notFlag;
                }

            } elseif ($expression instanceof MandatoryValidatorInterface) {
                return $expression->isMandatory();
            } elseif (is_bool($expression)) {
                return FALSE;
            }
            // reset $notFlag flag
            $notFlag = FALSE;
        }

        return TRUE;
    }

}

/**
 * @author Davide Principi <davide.principi@nethesis.it>
 * @internal
 */
class CollectionValidator implements MandatoryValidatorInterface
{
    /**
     *
     * @var ValidatorInterface
     */
    private $memberValidator;
    private $failureInfo;

    /**
     *
     * @var \Iterator
     */
    private $iterator;

    public function __construct(ValidatorInterface $memberValidator)
    {
        $this->memberValidator = $memberValidator;
    }

    public function evaluate($iterableObject)
    {
        $this->failureInfo = array();

        if (is_array($iterableObject)) {
            $iterableObject = new \ArrayObject($iterableObject);
            $this->iterator = $iterableObject->getIterator();
        } elseif ($iterableObject instanceof \IteratorAggregate) {
            $this->iterator = $iterableObject->getIterator();
        } elseif ($iterableObject instanceof \Iterator) {
            $this->iterator = $iterableObject;
        } else {
            $this->failureInfo[] = array("Not a collection", array());
            return FALSE;
        }

        foreach ($this->iterator as $e) {
            if ($this->memberValidator->evaluate($e) === FALSE) {
                $this->failureInfo = array_merge($this->failureInfo, $this->memberValidator->getFailureInfo());
                return FALSE;
            }
        }


        return TRUE;
    }

    public function getFailureInfo()
    {
        return $this->failureInfo;
    }

    public function isMandatory()
    {
        if ($this->memberValidator instanceof MandatoryValidatorInterface) {
            return $this->memberValidator->isMandatory();
        }
        return TRUE;
    }

}

/**
 * @author Davide Principi <davide.principi@nethesis.it>
 * @see Validator::orValidator()
 * @internal
 */
class OrValidator implements MandatoryValidatorInterface
{
    /**
     *
     * @var ValidatorInterface
     */
    private $v1;

    /**
     *
     * @var ValidatorInterface
     */
    private $v2;
    private $failureInfo;

    public function __construct(ValidatorInterface $v1, ValidatorInterface $v2)
    {
        $this->v1 = $v1;
        $this->v2 = $v2;
    }

    public function evaluate($value)
    {
        $this->failureInfo = array();
        $e1 = $this->v1->evaluate($value);

        if ($e1 === FALSE) {
            $e2 = $this->v2->evaluate($value);

            if ($e2 === FALSE) {
                $this->failureInfo = array_merge($this->failureInfo, $this->v1->getFailureInfo(), $this->v2->getFailureInfo());
                return FALSE;
            }
            return TRUE;
        }

        return TRUE;
    }

    public function getFailureInfo()
    {
        return $this->failureInfo;
    }

    public function isMandatory()
    {
        $m1 = ($this->v1 instanceof MandatoryValidatorInterface) ? $this->v1->isMandatory() : TRUE;
        $m2 = ($this->v2 instanceof MandatoryValidatorInterface) ? $this->v2->isMandatory() : TRUE;
        return ($m1 && $m2);
    }

}
