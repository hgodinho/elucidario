<?php
/**
 * DB class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Error;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * DB Error Class
 */
class DB extends Base {
	/**
	 * Set prefix.
	 *
	 * @return string
	 */
	public function set_prefix() {
		return 'db_';
	}

	/**
	 * Set possible errors.
	 *
	 * @return array
	 */
	public function set_possible_errors() {
		return array(
			'error'           => __( 'Database error.', 'lcdr' ),
			'insert'          => __( 'Database insert error.', 'lcdr' ),
			'update'          => __( 'Database update error.', 'lcdr' ),
			'get'             => __( 'Database get error.', 'lcdr' ),
			'not_implemented' => __( 'Not implemented.', 'lcdr' ),
			'invalid'         => __( 'Invalid.', 'lcdr' ),
		);
	}
}
