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
final class Option extends Row {
	/**
	 * Option ID.
	 *
	 * @var int
	 */
	public int $id = 0;

	/**
	 * Option name.
	 *
	 * @var string
	 */
	public string $name = '';

	/**
	 * Option value.
	 *
	 * @var mixed
	 */
	public mixed $value = '';

	/**
	 * Option order.
	 *
	 * @var int
	 */
	public int $order = 0;

	/**
	 * Constructor.
	 *
	 * @param mixed $item Item.
	 */
	public function __construct( $item = null ) {
		parent::__construct( $item );

		$this->id    = (int) $this->id;
		$this->name  = (string) $this->name;
		$this->order = (int) $this->order;
	}
}
