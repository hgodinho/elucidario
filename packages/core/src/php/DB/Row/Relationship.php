<?php
/**
 * Option class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Row;

use \BerlinDB\Database\Row;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Option row class.
 */
class Relationship extends Row implements \LCDR\DB\Interfaces\Relationship {
	/**
	 * Option ID.
	 *
	 * @var int
	 */
	public int $id = 0;

	/**
	 * Subject.
	 *
	 * @var integer
	 */
	public int $subject = 0;

	/**
	 * Predicate.
	 *
	 * @var string
	 */
	public string $predicate = '';

	/**
	 * Object.
	 *
	 * @var integer
	 */
	public int $object = 0;

	/**
	 * Order.
	 *
	 * @var integer
	 */
	public int $order = 0;

	/**
	 * Constructor.
	 *
	 * @param mixed $item Item.
	 */
	public function __construct( $item = null ) {
		parent::__construct( $item );

		$this->id        = (int) $this->rel_id;
		$this->subject   = (int) $this->subject;
		$this->predicate = (string) $this->predicate;
		$this->object    = (int) $this->object;
		$this->order     = (int) $this->rel_order;
	}
}
