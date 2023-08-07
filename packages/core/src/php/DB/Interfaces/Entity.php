<?php

/**
 * Entity interface.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Interfaces;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

interface Entity {

	/**
	 * Get the entity property.
	 *
	 * @return mixed
	 */
	public function get_property( string $property ): mixed;
}
