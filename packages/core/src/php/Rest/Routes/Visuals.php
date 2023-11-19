<?php
/**
 * Visuals Rest class.
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
 * Visuals Base Rest Class
 */
class Visuals extends \LCDR\Rest\Routes\Abstracts\Entities {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'visuals', 'lcdr' );
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
					'schema' => 'mdorim/visual',
				),
				'edit' => array(
					'schema' => 'mdorim/visual',
					'options' => array(
						'definitions' => 'VisualPost',
					),
				),
			),
			'la' => array(
				'view' => array(
					'schema' => 'linked-art/visual',
				),
			),
		);
	}
}
