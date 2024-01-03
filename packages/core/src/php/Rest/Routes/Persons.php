<?php
/**
 * Persons Rest class.
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
 * Persons Base Rest Class
 */
class Persons extends \LCDR\Rest\Routes\Abstracts\Entities {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'persons', 'lcdr' );
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
					'schema' => 'mdorim/person',
				),
				'edit' => array(
					'schema'  => 'mdorim/person',
					'options' => array(
						'definitions' => 'PersonPost',
					),
				),
			),
			'la'     => array(
				'view' => array(
					'schema' => 'linked-art/person',
				),
			),
		);
	}
}
