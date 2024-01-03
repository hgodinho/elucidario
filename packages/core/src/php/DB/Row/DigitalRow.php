<?php
/**
 * Digital class.
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
 * Digital row class.
 */
final class DigitalRow extends Entity {
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

			// digital specific
			'identified_by',
			'classified_as',
			'referred_to_by',
			'equivalent',
			'attributed_by',
			'dimension',
			'digitally_available_via',
			'representation',
			'member_of',
			'subject_of',
			'part_of',
			'conforms_to',
			'access_point',
			'digitally_carries',
			'digitally_shows',
			'used_for',
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
