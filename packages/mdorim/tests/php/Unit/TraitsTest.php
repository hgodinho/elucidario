<?php

class TraitTestCase {
	use \Mdorim\Traits\Debug;
	use \Mdorim\Traits\Singleton;
}

test( 'Singleton test', function () {
	expect( TraitTestCase::get_instance() )->toBeInstanceOf( TraitTestCase::class);
} );