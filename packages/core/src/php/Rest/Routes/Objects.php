<?php
/**
 * Objects Rest class.
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
 * Objects Base Rest Class
 */
class Objects extends \LCDR\Rest\Routes\Abstracts\Entities {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'objects', 'lcdr' );
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
					'schema' => 'mdorim/object',
				),
				'edit' => array(
					'schema'  => 'mdorim/object',
					'options' => array(
						'definitions' => 'ObjectPost',
					),
				),
			),
			'la'     => array(
				'view' => array(
					'schema' => 'linked-art/object',
				),
			),
		);
	}
}
