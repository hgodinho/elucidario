<?php
/**
 * Options class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Query;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Concepts query class.
 */
class Concepts extends Entities {
	/**
	 * Name of the item
	 *
	 * @var string
	 */
	protected $item_name = 'concept';

	/**
	 * Plural name of the item
	 *
	 * @var string
	 */
	protected $item_name_plural = 'concepts';

	/**
	 * Name of the class to use for each item
	 *
	 * @var string
	 */
	protected $item_shape = '\\LCDR\\DB\\Row\\Concept';
}
