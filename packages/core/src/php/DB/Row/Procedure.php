<?php
/**
 * Procedure class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Row;

use \BerlinDB\Database\Row;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Procedure row class.
 */
final class Procedure extends Row implements \LCDR\DB\Interfaces\Entity {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\debug, \LCDR\DB\Row\Row;

	/**
	 *                __
	 *    _________  / /_  ______ ___  ____  _____
	 *   / ___/ __ \/ / / / / __ `__ \/ __ \/ ___/
	 *  / /__/ /_/ / / /_/ / / / / / / / / (__  )
	 *  \___/\____/_/\__,_/_/ /_/ /_/_/ /_/____/
	 */
	/**
	 * Procedure ID.
	 *
	 * @var int
	 */
	public int $procedure_id = 0;

	/**
	 * Procedure type.
	 *
	 * @var string
	 */
	public string $type = '';

	/**
	 * Procedure guid.
	 *
	 * @var string
	 */
	public string $guid = '';

	/**
	 * Procedure description.
	 *
	 * @var string
	 */
	public string $description = '';

	/**
	 * Procedure author.
	 *
	 * @var int
	 */
	public int $author = 0;

	/**
	 * Procedure status.
	 *
	 * @var string
	 */
	public string $status = 'draft';

	/**
	 * Procedure created.
	 *
	 * @var string
	 */
	public string $created = '';

	/**
	 * Procedure modified.
	 *
	 * @var string
	 */
	public string $modified = '';

	/**
	 * Procedure schedule.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $schedule = null;

	/**
	 * Procedure entities.
	 *
	 * @var array
	 */
	public mixed $entities = array();

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Constructor.
	 *
	 * @param mixed $item Item.
	 */
	public function __construct( $item = null ) {
		parent::__construct( $item );

		// properties.
		$this->procedure_id = (int) $this->procedure_id;
		$this->type         = (string) $this->type;
		$this->guid         = (string) $this->guid;
		$this->description  = (string) $this->description;
		$this->author       = (int) $this->author;
		$this->created      = false === $this->created ? 0 : wp_date( get_option( 'date_format' ), $this->created );
		$this->modified     = false === $this->modified ? 0 : wp_date( get_option( 'date_format' ), $this->modified );
		$this->status       = (string) $this->status;
		$this->schedule     = json_decode( $this->schedule );
		$this->entities     = $this->init_entities();
	}

	public function set_allowed_properties() {
		return array(
			'procedure_id',
			'type',
			'guid',
			'description',
			'author',
			'created',
			'modified',
			'status',
			'schedule',
			'entities',
		);
	}

	/**
	 *                 _             __
	 *     ____  _____(_)   ______ _/ /____
	 *    / __ \/ ___/ / | / / __ `/ __/ _ \
	 *   / /_/ / /  / /| |/ / /_/ / /_/  __/
	 *  / .___/_/  /_/ |___/\__,_/\__/\___/
	 * /_/
	 */
	/**
	 * Init entities.
	 *
	 * @return int[]
	 */
	private function init_entities() {
		$procedures_entities = new \LCDR\DB\Query\ProceduresEntities();
		$relationships       = $procedures_entities->get_relationships( array( 'procedure_id' => $this->procedure_id ) );

		$entities = \wp_list_pluck( $relationships, 'entity_id' );

		return $entities;
	}
}
