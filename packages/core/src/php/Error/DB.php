<?php
/**
 * DB class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * DB Error Class
 */
class DB extends Base {
	/**
	 * Set possible errors.
	 *
	 * @return array
	 */
	public function set_possible_errors() {
		return array(
			'db_error' => __( 'Database error.', 'lcdr' ),
		);
	}
}
