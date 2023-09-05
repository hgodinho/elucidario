<?php
/**
 * Relationships class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Schema;

use \BerlinDB\Database\Schema;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Relationships schema class.
 */
final class Relationships extends Schema {
	/**
	 * Columns.
	 *
	 * @var array
	 */
	public $columns = array(
		'rel_id'    => array(
			'name'       => 'rel_id',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'primary'    => true,
			'allow_null' => false,
			'extra'      => 'auto_increment',
		),
		'subject'   => array(
			'name'       => 'subject',
			'type'       => 'bigint',
			'length'     => 20,
			'default'    => 0,
			'allow_null' => false,
			'searchable' => true,
			'sortable'   => true,
		),
		'predicate' => array(
			'name'       => 'predicate',
			'type'       => 'varchar',
			'length'     => 30,
			'default'    => '',
			'allow_null' => false,
		),
		'object'    => array(
			'name'       => 'object',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'default'    => 0,
			'allow_null' => false,
			'searchable' => true,
			'sortable'   => true,
		),
		'rel_order' => array(
			'name'       => 'rel_order',
			'type'       => 'int',
			'length'     => 11,
			'default'    => 0,
			'allow_null' => false,
			'sortable'   => true,
			'searchable' => true,
		),
	);

}
