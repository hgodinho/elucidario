<?php
/**
 * Entities class.
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
 * Entities schema class.
 */
class Entities extends Schema {
	/**
	 * Columns.
	 *
	 * @var array
	 */
	public $columns = array(
		'entity_id'               => array(
			'name'       => 'entity_id',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'primary'    => true,
			'allow_null' => false,
			'extra'      => 'auto_increment',
		),
		'name'                    => array(
			'name'       => 'name',
			'type'       => 'varchar',
			'length'     => 255,
			'default'    => '',
			'allow_null' => false,
			'searchable' => true,
			'sortable'   => true,
		),
		'guid'                    => array(
			'name'       => 'guid',
			'type'       => 'varchar',
			'length'     => 255,
			'default'    => '',
			'allow_null' => false,
		),
		'author'                  => array(
			'name'       => 'author',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'default'    => 0,
			'allow_null' => false,
			'searchable' => true,
			'sortable'   => true,
		),
		'status'                  => array(
			'name'       => 'status',
			'type'       => 'varchar',
			'length'     => 20,
			'default'    => 'publish',
			'allow_null' => false,
		),
		'password'                => array(
			'name'       => 'password',
			'type'       => 'varchar',
			'length'     => 255,
			'allow_null' => true,
		),
		'created'                 => array(
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
		'modified'                => array(
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
		'type'                    => array(
			'name'       => 'type',
			'type'       => 'varchar',
			'length'     => 60,
			'default'    => '',
			'allow_null' => false,
		),
		'label'                   => array(
			'name'       => 'label',
			'type'       => 'varchar',
			'length'     => 255,
			'default'    => '',
			'allow_null' => false,
			'searchable' => true,
			'sortable'   => true,
		),
		'identified_by'           => array(
			'name'       => 'identified_by',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'referred_to_by'          => array(
			'name'       => 'referred_to_by',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'equivalent'              => array(
			'name'       => 'equivalent',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'attributed_by'           => array(
			'name'       => 'attributed_by',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'dimension'               => array(
			'name'       => 'dimension',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'format'                  => array(
			'name'       => 'format',
			'type'       => 'varchar',
			'length'     => 60,
			'allow_null' => true,
		),
		'digitally_available_via' => array(
			'name'       => 'digitally_available_via',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'created_by'              => array(
			'name'       => 'created_by',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'contact_point'           => array(
			'name'       => 'contact_point',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'begin_of_existence'      => array(
			'name'       => 'begin_of_existence',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'end_of_existence'        => array(
			'name'       => 'end_of_existence',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'timespan'                => array(
			'name'       => 'timespan',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'part'                    => array(
			'name'       => 'part',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'produced_by'             => array(
			'name'       => 'produced_by',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'destroyed_by'            => array(
			'name'       => 'destroyed_by',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'removed_by'              => array(
			'name'       => 'removed_by',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'defined_by'              => array(
			'name'       => 'defined_by',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
		'content'                 => array(
			'name'       => 'content',
			'type'       => 'json',
			'default'    => 0,
			'allow_null' => false,
		),
	);

}
