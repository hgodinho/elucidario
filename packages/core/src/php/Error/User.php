<?php
/**
 * User class.
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
 * User Error Class
 */
class User extends Base {
	/**
	 * Set prefix.
	 *
	 * @return string
	 */
	public function set_prefix() {
		return 'user_';
	}

	/**
	 * Set possible errors.
	 *
	 * @return array
	 */
	public function set_possible_errors() {
		return array(
			'undefined_role' => __( 'Undefined user role.', 'lcdr' ),
			'unknown_role'   => __( 'Unknown user role.', 'lcdr' ),
		);
	}
}
