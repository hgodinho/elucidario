<?php

test( 'lcdr_hook', function () {
	expect( lcdr_hook( [ 'test' ] ) )->toBe( 'lcdr_test' );
} );