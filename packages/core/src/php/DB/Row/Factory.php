<?php
/**
 * Factory row class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Row;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Final class Factory
 */
final class Factory {
	use \LCDR\Utils\debug;

	/**
	 * Create a new entity.
	 *
	 * @param mixed $item Item to create.
	 * @return \LCDR\DB\Interfaces\Entity|\LCDR\Error\Factory
	 */
	public static function create( mixed $item ) {
		if ( empty( $item ) ) {
			return new \LCDR\Error\Factory( 'empty_item' );
		}
		$entity = null;
		if ( $item instanceof \LCDR\DB\Row\Entity ) {
			$entity = $item;
		}
		if ( is_array( $item ) ) {
			$entity = new \LCDR\DB\Row\Entity( $item );
		}
		if ( is_int( $item ) ) {
			$entities = new \LCDR\DB\Query\Entities();
			$entity   = $entities->get_entity( $item );
		}
		$error = new \LCDR\Error\Factory(
			'unknown_type',
			array(
				'item'   => $item,
				'entity' => $entity,
			)
		);
		if ( $entity instanceof \LCDR\DB\Row\Entity ) {
			switch ( $entity->type ) {
				case 'Concept':
				case 'Type':
					$concept = new \LCDR\DB\Row\Concept( (array) $entity );
					return $concept;
				default:
					return $error;
			}
		}
		return $error;
	}

}
