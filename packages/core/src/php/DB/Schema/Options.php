<?php
/**
 * Options class.
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
 * Options schema class.
 */
final class Options extends Schema {
	/**
	 * Columns.
	 *
	 * @var array
	 */
	public $columns = array(
		'id'    => array(
			'name'       => 'id',
			'type'       => 'bigint',
			'length'     => 20,
			'unsigned'   => true,
			'primary'    => true,
			'allow_null' => false,
			'extra'      => 'auto_increment',
		),
		'name'  => array(
			'name'       => 'name',
			'type'       => 'varchar',
			'length'     => 127,
			'default'    => '',
			'allow_null' => false,
		),
		'value' => array(
			'name'       => 'value',
			'type'       => 'json',
			'allow_null' => false,
		),
	);

}
