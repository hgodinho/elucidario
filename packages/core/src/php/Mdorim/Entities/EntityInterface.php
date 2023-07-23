<?php
/**
 * Entity interface.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Mdorim\Entities;

interface EntityInterface {
	/**
	 * Get entity property.
	 *
	 * @param string $property
	 * @return mixed
	 * @throws \Exception
	 */
	public function get( $property ): mixed;
}