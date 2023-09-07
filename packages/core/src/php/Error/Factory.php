<?php
/**
 * Factory class.
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
 * Factory Error Class
 */
class Factory extends Base {
	/**
	 * Set prefix.
	 *
	 * @return string
	 */
	public function set_prefix() {
		return 'factory_';
	}

	/**
	 * Set possible errors.
	 *
	 * @return array
	 */
	public function set_possible_errors() {
		return array(
			'empty_item'   => __( 'Sorry, the item is empty.', 'lcdr' ),
			'unknown_type' => __( 'Sorry, unknown entity type', 'lcdr' ),
		);
	}
}
