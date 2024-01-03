<?php
/**
 * Digitals Rest class.
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
 * Digitals Base Rest Class
 */
class Digitals extends \LCDR\Rest\Routes\Abstracts\Entities {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'digitals', 'lcdr' );
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
					'schema' => 'mdorim/digital',
				),
				'edit' => array(
					'schema'  => 'mdorim/digital',
					'options' => array(
						'definitions' => 'DigitalPost',
					),
				),
			),
			'la'     => array(
				'view' => array(
					'schema' => 'linked-art/digital',
				),
			),
		);
	}
}
