<?php
/**
 * Concepts Rest class.
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
 * Concepts Base Rest Class
 */
class Concepts extends \LCDR\Rest\Routes\Abstracts\Entities {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'concepts', 'lcdr' );
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
					'schema' => 'mdorim/concept',
				),
				'edit' => array(
					'schema'  => 'mdorim/concept',
					'options' => array(
						'definitions' => 'ConceptPost',
					),
				),
			),
			'la'     => array(
				'view' => array(
					'schema' => 'linked-art/concept',
				),
			),
		);
	}
}
