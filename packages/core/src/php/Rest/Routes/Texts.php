<?php
/**
 * Texts Rest class.
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
 * Texts Base Rest Class
 */
class Texts extends \LCDR\Rest\Routes\Abstracts\Entities {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'texts', 'lcdr' );
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
					'schema' => 'mdorim/text',
				),
				'edit' => array(
					'schema' => 'mdorim/text',
					'options' => array(
						'definitions' => 'TextPost',
					),
				),
			),
			'la' => array(
				'view' => array(
					'schema' => 'linked-art/text',
				),
			),
		);
	}
}
