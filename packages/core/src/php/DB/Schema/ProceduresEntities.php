<?php
/**
 * ProceduresEntities class.
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
 * ProceduresEntities schema class.
 */
final class ProceduresEntities extends Schema {
	/**
	 * Columns.
	 *
	 * @var array
	 */
	public $columns = array(
		'rel_id'       => array(
			'name'       => 'rel_id',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'primary'    => true,
			'allow_null' => false,
			'extra'      => 'auto_increment',
		),
		'entity_id'    => array(
			'name'       => 'entity_id',
			'type'       => 'bigint',
			'length'     => 20,
			'default'    => 0,
			'allow_null' => false,
			'searchable' => true,
			'sortable'   => true,
		),
		'procedure_id' => array(
			'name'       => 'procedure_id',
			'type'       => 'varchar',
			'length'     => 30,
			'default'    => '',
			'allow_null' => false,
		),
		'rel_order'    => array(
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
