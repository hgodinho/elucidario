<?php
/**
 * Entity interface.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Interfaces\Model;

interface Entity {
	/**
	 * Get entity property.
	 *
	 * @param string $property
	 * @return mixed
	 * @throws \Exception
	 */
	public function get( $property ): mixed;
}