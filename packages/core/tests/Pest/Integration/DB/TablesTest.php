<?php

namespace LCDR\Tests\Pest\Integration\DB;

test( '\LCDR\DB\Table\Entities instance', function () {
	$table = new \LCDR\DB\Table\Entities();
	expect( $table )->toBeInstanceOf( \LCDR\DB\Table\Entities::class);
} );

test( '\LCDR\DB\Table\Mappings instance', function () {
	$table = new \LCDR\DB\Table\Mappings();
	expect( $table )->toBeInstanceOf( \LCDR\DB\Table\Mappings::class);
} );

test( '\LCDR\DB\Table\PropsMaps instance', function () {
	$table = new \LCDR\DB\Table\PropsMaps();
	expect( $table )->toBeInstanceOf( \LCDR\DB\Table\PropsMaps::class);
} );

test( '\LCDR\DB\Table\Options instance', function () {
	$table = new \LCDR\DB\Table\Options();
	expect( $table )->toBeInstanceOf( \LCDR\DB\Table\Options::class);
} );

test( '\LCDR\DB\Table\Procedures instance', function () {
	$table = new \LCDR\DB\Table\Procedures();
	expect( $table )->toBeInstanceOf( \LCDR\DB\Table\Procedures::class);
} );

test( '\LCDR\DB\Table\ProceduresEntities instance', function () {
	$table = new \LCDR\DB\Table\ProceduresEntities();
	expect( $table )->toBeInstanceOf( \LCDR\DB\Table\ProceduresEntities::class);
} );

test( '\LCDR\DB\Table\Relationships instance', function () {
	$table = new \LCDR\DB\Table\Relationships();
	expect( $table )->toBeInstanceOf( \LCDR\DB\Table\Relationships::class);
} );