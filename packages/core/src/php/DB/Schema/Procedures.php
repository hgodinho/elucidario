<?php
/**
 * Procedures class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Schema;

use \BerlinDB\Database\Schema;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Procedures schema class.
 */
class Procedures extends Schema {
	/**
	 * Columns.
	 *
	 * @var array
	 */
	public $columns = array(
		'procedure_id' => array(
			'name'       => 'procedure_id',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'primary'    => true,
			'allow_null' => false,
			'extra'      => 'auto_increment',
		),
		'type'         => array(
			'name'       => 'type',
			'type'       => 'varchar',
			'length'     => 64,
			'searchable' => true,
			'sortable'   => true,
		),
		'guid'         => array(
			'name'       => 'guid',
			'type'       => 'varchar',
			'length'     => 40,
			'default'    => '',
			'allow_null' => false,
		),
		'description'  => array(
			'name'    => 'description',
			'type'    => 'longtext',
			'default' => '',
		),
		'author'       => array(
			'name'       => 'author',
			'type'       => 'bigint',
			'length'     => 20,
			'default'    => 0,
			'allow_null' => false,
		),
		'created'      => array(
			'name'       => 'created',
			'type'       => 'datetime',
			'date_query' => true,
			'unsigned'   => true,
			'allow_null' => false,
			'created'    => true,
			'searchable' => true,
			'sortable'   => true,
			'default'    => '0000-00-00 00:00:00',
		),
		'modified'     => array(
			'name'       => 'modified',
			'type'       => 'datetime',
			'date_query' => true,
			'unsigned'   => true,
			'allow_null' => false,
			'modified'   => true,
			'searchable' => true,
			'sortable'   => true,
			'default'    => '0000-00-00 00:00:00',
		),
		'status'       => array(
			'name'       => 'status',
			'type'       => 'varchar',
			'length'     => 30,
			'default'    => 'draft',
			'allow_null' => false,
			'searchable' => true,
			'sortable'   => true,
		),
		'schedule'     => array(
			'name'       => 'schedule',
			'type'       => 'json',
			'allow_null' => true,
		),
	);

}
