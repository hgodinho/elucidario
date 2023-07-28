<?php

/**
 * Options class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Schema;

use \BerlinDB\Database\Schema;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

class Options extends Schema {
	public $columns = [ 
		'id' => [ 
			'name' => 'id',
			'type' => 'bigint',
			'length' => 20,
			'unsigned' => true,
			'primary' => true,
			'allow_null' => false,
			'extra' => 'auto_increment',
		],
		'name' => [ 
			'name' => 'name',
			'type' => 'varchar',
			'length' => 127,
			'default' => '',
			'allow_null' => false,
		],
		'value' => [ 
			'name' => 'value',
			'type' => 'json',
			'allow_null' => false,
		],
	];

}