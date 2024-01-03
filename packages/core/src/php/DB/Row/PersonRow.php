<?php
/**
 * Person class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Row;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Person row class.
 */
final class PersonRow extends Entity {
	/**
	 * Allowed properties
	 *
	 * @var array
	 */
	public function set_allowed_properties() {
		return array(
			// default
			'entity_id',
			'name',
			'guid',
			'created',
			'modified',
			'password',
			'author',
			'status',
			'_label',
			'type',

			// person specific
			'identified_by',
			'classified_as',
			'referred_to_by',
			'equivalent',
			'representation',
			'member_of',
			'subject_of',
			'attributed_by',
			'contact_point',
			'born',
			'died',
			'carried_out',
			'residence',
			'created_by',
		);
	}

	/**
	 * Constructor.
	 *
	 * @param array $item Item.
	 */
	public function __construct( $item = null ) {
		parent::__construct( $item );
	}
}
