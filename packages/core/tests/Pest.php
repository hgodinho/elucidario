<?php

use Yoast\WPTestUtils\BrainMonkey\TestCase;

uses()->group('integration')->in('Pest/Integration');
uses()->group('unit')->in('Pest/Unit');

uses(TestCase::class)->in('Unit');

function isUnitTest() {
    return !empty($GLOBALS['argv']) && $GLOBALS['argv'][1] === '--group=unit';
}
