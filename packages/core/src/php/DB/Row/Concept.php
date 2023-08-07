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
class Concept extends Entity {
	/**
	 * Broader concepts.
	 *
	 * @var array
	 */
	public array $broader = array();

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
