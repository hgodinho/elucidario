<?php
/**
 * User class.
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
 * User Error Class
 */
class User extends Base {
	/**
	 * Set possible errors.
	 *
	 * @return array
	 */
	public function set_possible_errors() {
		return array(
			'undefined_user_role' => __( 'Undefined user role.', 'lcdr' ),
			'unknown_user_role'   => __( 'Unknown user role.', 'lcdr' ),
		);
	}
}
