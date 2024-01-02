<?php
/**
 * Events Rest class.
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
 * Events Base Rest Class
 */
class Events extends \LCDR\Rest\Routes\Abstracts\Entities {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'events', 'lcdr' );
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
					'schema' => 'mdorim/event',
				),
				'edit' => array(
					'schema'  => 'mdorim/event',
					'options' => array(
						'definitions' => 'EventPost',
					),
				),
			),
			'la'     => array(
				'view' => array(
					'schema' => 'linked-art/event',
				),
			),
		);
	}
}
