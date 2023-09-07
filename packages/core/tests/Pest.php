<?php

use Yoast\WPTestUtils\BrainMonkey\TestCase;

uses()->group( 'integration' )->in( 'Pest/Integration' );
uses()->group( 'unit' )->in( 'Pest/Unit' );

function isUnitTest() {
	return ! empty( $GLOBALS['argv'] ) && isset( $GLOBALS['argv'][1] ) && $GLOBALS['argv'][1] === '--group=unit';
}