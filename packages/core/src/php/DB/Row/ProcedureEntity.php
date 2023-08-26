<?php
/**
 * ProcedureEntity class.
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
 * ProcedureEntity row class.
 */
final class ProcedureEntity extends Row {
	/**
	 * ProcedureEntity ID.
	 *
	 * @var int
	 */
	public int $rel_id = 0;

	/**
	 * Subject.
	 *
	 * @var integer
	 */
	public int $entity_id = 0;

	/**
	 * Predicate.
	 *
	 * @var string
	 */
	public string $procedure_id = '';

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

		$this->rel_id       = (int) $this->rel_id;
		$this->entity_id    = (int) $this->entity_id;
		$this->procedure_id = (string) $this->procedure_id;
		$this->rel_order    = (int) $this->rel_order;
	}
}
