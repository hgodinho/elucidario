<?php
/**
 * Option class.
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
 * Concept row class.
 */
final class Concept extends Entity {
	/**
	 * Broader concepts.
	 *
	 * @var array
	 */
	public array $broader = array();

	/**
	 * Allowed properties
	 *
	 * @var array
	 */
	public array $allowed_properties = array(
		'identified_by',
		'classified_as',
		'referred_to_by',
		'equivalent',
		'representation',
		'member_of',
		'subject_of',
		'attributed_by',
		'created_by',
		'broader',
	);

	/**
	 * Constructor.
	 *
	 * @param array $item Item.
	 */
	public function __construct( $item = null ) {
		parent::__construct( $item );

		$this->broader = (array) $this->broader;
	}
}
