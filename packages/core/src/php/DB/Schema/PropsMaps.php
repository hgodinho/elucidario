<?php
/**
 * PropsMaps class.
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
 * Mapping schema class.
 */
class PropsMaps extends Schema {
	/**
	 * Columns.
	 *
	 * @var array
	 */
	public $columns = array(
		'map_id'                    => array(
			'name'       => 'map_id',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'primary'    => true,
			'allow_null' => false,
			'extra'      => 'auto_increment',
		),
		'mapping_id'                => array(
			'name'       => 'mapping_id',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'allow_null' => false,
		),
		'description'               => array(
			'name'    => 'description',
			'type'    => 'longtext',
			'default' => '',
		),
		'prop_name'                 => array(
			'name'       => 'prop_name',
			'type'       => 'varchar',
			'length'     => 50,
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
			'default'    => '',
		),
		'entity_type'               => array(
			'name'       => 'entity_type',
			'type'       => 'varchar',
			'length'     => 50,
			'default'    => '',
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
		),
		'external_prop_name'        => array(
			'name'       => 'external_prop_name',
			'type'       => 'varchar',
			'length'     => 100,
			'default'    => '',
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
		),
		'external_prop_description' => array(
			'name'    => 'external_prop_description',
			'type'    => 'longtext',
			'default' => '',
		),
		'external_prop_uri'         => array(
			'name'       => 'external_prop_uri',
			'type'       => 'varchar',
			'length'     => 255,
			'default'    => '',
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
		),
		'external_prop_type'        => array(
			'name'       => 'external_prop_type',
			'type'       => 'varchar',
			'length'     => 255,
			'default'    => '',
			'searchable' => true,
			'sortable'   => true,
			'allow_null' => false,
		),
		'map_value'                 => array(
			'name' => 'map_value',
			'type' => 'json',
		),
		'editable'                  => array(
			'name'       => 'editable',
			'type'       => 'tinyint',
			'length'     => 1,
			'default'    => 1,
			'allow_null' => false,
		),
		'status'                    => array(
			'name'       => 'status',
			'type'       => 'varchar',
			'length'     => 20,
			'default'    => 'active',
			'allow_null' => false,
			'searchable' => true,
			'sortable'   => true,
		),
	);
}
