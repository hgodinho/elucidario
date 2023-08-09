<?php
/**
 * Table class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Table;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Abstract table class.
 */
abstract class Table extends \BerlinDB\Database\Table {
	/**
	 * Table version key.
	 *
	 * @var string
	 */
	protected $db_version_key = 'lcdr_db_version';

	/**
	 * Table version.
	 *
	 * @var string
	 */
	protected $db_version = '1.0.0';

	/**
	 * Table prefix.
	 *
	 * @var string
	 */
	protected $prefix = 'lcdr';
}
