<?php
/**
 * Visual class.
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
 * Visual row class.
 */
final class VisualRow extends Entity {
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

			// object specific
			'identified_by',
			'classified_as',
			'referred_to_by',
			'equivalent',
			'representation',
			'member_of',
			'subject_of',
			'part_of',
			'used_for',
			'took_place_at',
			'caused_by',
			'carried_out_by',
			'used_specific_object',
			'influenced_by',
			'technique',
			'digitally_shown_by',
			'shown_by',
			'about',
			'represents',
			'represents_instance_of_type',
			'attributed_by',
			'dimension',
			'timespan',
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
