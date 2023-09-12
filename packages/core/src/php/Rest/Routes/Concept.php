<?php
/**
 * Concept Rest class.
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
 * Concept Base Rest Class
 */
class Concept extends Base {
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
			'wp' => array(
				\WP_REST_Server::READABLE  => array(
					'schema' => 'mdorim/concept',
				),
				\WP_REST_Server::CREATABLE => array(
					'schema'  => 'mdorim/concept',
					'options' => array(
						'definitions' => 'ConceptPost',
					),
				),
			),
			'la' => array(
				\WP_REST_Server::READABLE => array(
					'schema' => 'linked-art/concept',
				),
			),
		);
	}

	/**
	 * Set permission group.
	 *
	 * @return string
	 */
	public function set_permission_group() {
		return 'entities';
	}
}
