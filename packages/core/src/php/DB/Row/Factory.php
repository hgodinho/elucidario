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
		if ( is_int( $item ) && $item > 0 ) {
			$entities = new \LCDR\DB\Query\Entities();
			$entity = $entities->get_entity( $item );
		}
		$error = new \LCDR\Error\Factory(
			'unknown_type',
			array(
				'item' => $item,
				'entity' => $entity,
			)
		);
		if ( $entity instanceof \LCDR\DB\Row\Entity ) {
			switch ( $entity->type ) {
				case 'Concept':
				case 'Type':
					return new \LCDR\DB\Row\ConceptRow( (array) $entity );

				case 'HumanMadeObject':
					return new \LCDR\DB\Row\ObjectRow( (array) $entity );

				case 'DigitalObject':
					return new \LCDR\DB\Row\DigitalRow( (array) $entity );

				case 'Group':
					return new \LCDR\DB\Row\GroupRow( (array) $entity );

				case 'Person':
					return new \LCDR\DB\Row\PersonRow( (array) $entity );

				case 'Activity':
				case 'Event':
				case 'Provenance':
					return new \LCDR\DB\Row\EventRow( (array) $entity );

				case 'Place':
					return new \LCDR\DB\Row\PlaceRow( (array) $entity );

				case 'Set':
					return new \LCDR\DB\Row\SetRow( (array) $entity );

				case 'VisualItem':
					return new \LCDR\DB\Row\VisualRow( (array) $entity );

				case 'LinguisticObject':
					return new \LCDR\DB\Row\TextualRow( (array) $entity );

				default:
					return $error;
			}
		}
		return $error;
	}

}
