<?php
/**
 * Sets Rest class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Rest\Routes;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Sets Base Rest Class
 */
class Sets extends \LCDR\Rest\Routes\Abstracts\Entities {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'sets', 'lcdr' );
	}

	/**
	 * Set schema.
	 *
	 * @return array
	 */
	public function set_schema() {
		return array(
			'mdorim' => array(
				'view' => array(
					'schema' => 'mdorim/set',
				),
				'edit' => array(
					'schema'  => 'mdorim/set',
					'options' => array(
						'definitions' => 'SetPost',
					),
				),
			),
			'la'     => array(
				'view' => array(
					'schema' => 'linked-art/set',
				),
			),
		);
	}
}
