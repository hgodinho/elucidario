<?php
/**
 * Mapping class.
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
 * Mapping schema class.
 */
class Mappings extends Schema {
	/**
	 * Columns.
	 *
	 * @var array
	 */
	public $columns = array(
		'mapping_id'  => array(
			'name'       => 'mapping_id',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'primary'    => true,
			'allow_null' => false,
			'extra'      => 'auto_increment',
		),
		'name'        => array(
			'name'       => 'name',
			'type'       => 'varchar',
			'length'     => 255,
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
		),
		'uuid'        => array(
			'name'       => 'uuid',
			'type'       => 'varchar',
			'length'     => 40,
			'default'    => '',
			'allow_null' => false,
			'uuid'       => true,
		),
		'title'       => array(
			'name'       => 'title',
			'type'       => 'varchar',
			'length'     => 255,
			'default'    => '',
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
		),
		'standard'    => array(
			'name'       => 'standard',
			'type'       => 'varchar',
			'length'     => 255,
			'default'    => '',
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
		),
		'uri'         => array(
			'name'   => 'uri',
			'type'   => 'varchar',
			'length' => 255,
		),
		'description' => array(
			'name'    => 'description',
			'type'    => 'longtext',
			'default' => '',
		),
		'author'      => array(
			'name'       => 'author',
			'type'       => 'bigint',
			'length'     => 20,
			'default'    => 0,
			'allow_null' => false,
		),
		'version'     => array(
			'name'       => 'version',
			'type'       => 'varchar',
			'length'     => 30,
			'searchable' => true,
			'sortable'   => true,
		),
		'created'     => array(
			'name'       => 'created',
			'type'       => 'datetime',
			'date_query' => true,
			'unsigned'   => true,
			'created'    => true,
			'default'    => '0000-00-00 00:00:00',
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
		),
		'modified'    => array(
			'name'       => 'modified',
			'type'       => 'datetime',
			'date_query' => true,
			'unsigned'   => true,
			'modified'   => true,
			'default'    => '0000-00-00 00:00:00',
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
		),
	);
}
