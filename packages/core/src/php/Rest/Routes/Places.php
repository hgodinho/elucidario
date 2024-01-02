<?php
/**
 * Places Rest class.
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
 * Places Base Rest Class
 */
class Places extends \LCDR\Rest\Routes\Abstracts\Entities {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'places', 'lcdr' );
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
					'schema' => 'mdorim/place',
				),
				'edit' => array(
					'schema'  => 'mdorim/place',
					'options' => array(
						'definitions' => 'PlacePost',
					),
				),
			),
			'la'     => array(
				'view' => array(
					'schema' => 'linked-art/place',
				),
			),
		);
	}
}
