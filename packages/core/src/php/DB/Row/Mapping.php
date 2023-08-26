<?php
/**
 * Mapping class.
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
 * Mapping row class.
 */
final class Mapping extends Row {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\debug;

	/**
	 *                __
	 *    _________  / /_  ______ ___  ____  _____
	 *   / ___/ __ \/ / / / / __ `__ \/ __ \/ ___/
	 *  / /__/ /_/ / / /_/ / / / / / / / / (__  )
	 *  \___/\____/_/\__,_/_/ /_/ /_/_/ /_/____/
	 */
	/**
	 * Mapping ID.
	 *
	 * @var int
	 */
	public int $mapping_id = 0;

	/**
	 * Mapping title.
	 *
	 * @var string
	 */
	public string $title = '';

	/**
	 * Mapping name.
	 *
	 * @var string
	 */
	public string $name = '';

	/**
	 * Mapping description.
	 *
	 * @var string
	 */
	public string $description = '';

	/**
	 * Mapping author.
	 *
	 * @var int
	 */
	public int $author = 0;

	/**
	 * Mapping version.
	 *
	 * @var string
	 */
	public string $version = '';

	/**
	 * Mapping created.
	 *
	 * @var string
	 */
	public string $created = '';

	/**
	 * Mapping modified.
	 *
	 * @var string
	 */
	public string $modified = '';

	/**
	 * Mapping.
	 *
	 * @var \LCDR\DB\Row\PropMap[]
	 */
	public array $mappings = array();

	/**
	 *      _       __                        __
	 *     (_)___  / /____  _________  ____ _/ /
	 *    / / __ \/ __/ _ \/ ___/ __ \/ __ `/ /
	 *   / / / / / /_/  __/ /  / / / / /_/ / /
	 *  /_/_/ /_/\__/\___/_/  /_/ /_/\__,_/_/
	 */


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
		$this->mapping_id  = (int) $this->mapping_id;
		$this->name        = (string) $this->name;
		$this->title       = (string) $this->title;
		$this->author      = (int) $this->author;
		$this->version     = (string) $this->version;
		$this->created     = false === $this->created ? 0 : wp_date( get_option( 'date_format' ), $this->created );
		$this->modified    = false === $this->modified ? 0 : wp_date( get_option( 'date_format' ), $this->modified );
		$this->description = (string) $this->description;
		$this->init_mapping();
	}

	/**
	 *                       __            __           __
	 *     ____  _________  / /____  _____/ /____  ____/ /
	 *    / __ \/ ___/ __ \/ __/ _ \/ ___/ __/ _ \/ __  /
	 *   / /_/ / /  / /_/ / /_/  __/ /__/ /_/  __/ /_/ /
	 *  / .___/_/   \____/\__/\___/\___/\__/\___/\__,_/
	 * /_/
	 */

	/**
	 *                 _             __
	 *     ____  _____(_)   ______ _/ /____
	 *    / __ \/ ___/ / | / / __ `/ __/ _ \
	 *   / /_/ / /  / /| |/ / /_/ / /_/  __/
	 *  / .___/_/  /_/ |___/\__,_/\__/\___/
	 * /_/
	 */
	private function init_mapping() {
		$prop_map       = new \LCDR\DB\Query\PropsMaps();
		$this->mappings = $prop_map->get_props_maps_by_mapping_id( $this->mapping_id );
	}
}
