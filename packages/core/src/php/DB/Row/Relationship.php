<?php
/**
 * Relationship class.
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
 * Relationship row class.
 */
final class Relationship extends Row implements \LCDR\DB\Interfaces\Relationship {
	/**
	 * Relationship ID.
	 *
	 * @var int
	 */
	public int $rel_id = 0;

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
	public int $rel_order = 0;

	/**
	 * Constructor.
	 *
	 * @param mixed $item Item.
	 */
	public function __construct( $item = null ) {
		parent::__construct( $item );

		$this->rel_id    = (int) $this->rel_id;
		$this->subject   = (int) $this->subject;
		$this->predicate = (string) $this->predicate;
		$this->object    = (int) $this->object;
		$this->rel_order = (int) $this->rel_order;
	}
}
