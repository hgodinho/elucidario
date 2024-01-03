<?php
/**
 * Schema class.
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
 * Schema Error Class
 */
class Schema extends Base {
	/**
	 * Constructor.
	 *
	 * @param string $message Error message.
	 * @param mixed  $data Error data.
	 */
	public function __construct( $message, $data ) {
		parent::__construct( 'invalid', $data, $message );
	}

	/**
	 * Set prefix.
	 *
	 * @return string
	 */
	public function set_prefix() {
		return 'schema_';
	}

	/**
	 * Set possible errors.
	 *
	 * @return array
	 */
	public function set_possible_errors() {
		return array(
			'invalid' => '',
		);
	}
}
