<?php
/**
 * Entity interface.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Interfaces;

interface Entity {
	/**
	 * Get the entity property.
	 *
	 * @param string $property Property name.
	 * @return mixed
	 */
	public function get_property( string $property ): mixed;

	/**
	 * Get the allowed properties.
	 *
	 * @return array
	 */
	public function get_allowed_properties(): array;
}
